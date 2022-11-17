# Transaction Broadcaster Service
This service can be broken down into 3 main segments (adjustable based on actual requirements):
   * **API service** to handle client requests (broadcast tx), 
   * **Admin service** to view all tx & retry a specific tx
   * **Transaction service** to communicate with node and retry failed transaction

### Transaction service
Firstly, I will talk about the transaction service. The transaction service serves as the main entry point to the blockchain node. This segregation allows for better separation of concerns and also more reslience to failure for the whole system. Failure in this service, does not block other services.

This service has a main endpoint that broadcasts or retry a signed transaction. 
   * Upon a new signed transaction request, the service will **send a RPC request to the blockchain network** and **await for at least 1 confirmation of the transaction** to ensure that transaction is validate by at least 1 other user. 
   * This pending transaction will be saved in the Redis Store for status checking and resiliency against service failure. All data required for resigning & retrying the transaction is saved and stored in Redis.
   * The signed transaction with at least 1 confirmation is sent back to the requested service

This service also runs a cron job every 30 seconds that checks the statuses of pending transaction. (This service can actually be split into a separate running node, depending on the availability of resources)
   * For each pending transaction in the Redis Store, the service checks the status on the blockchain network.
   * If the status is completed, the transaction is removed from Redis and stored in a more persistent database (eg. SQL) for record purposes.
   * If the status is failed, the transaction is retried.
   * After the retry count hit a max threshold, the transaction is marked as failed.

### API service
This API service have an internal api `POST /broadcast_transaction`, with the behaviour as mentioned above. The high-level flow of the service is as follows:
   1. Client sends a broadcast request to the server
   2. Server validates the request data and ensure that everthing is in order
   3. Server signs the transaction
   4. Server sends the signed transaction to the Transaction service and await for the transaction to be confirmed by at least 1 users (can be removed based on requirements)
   5. Server sends the signed transaction back to user with `200 OK`
   6. In the event that any of the above results in an error, the most accurate `400` error is returned to the user, with the details of error (if eligible, eg. missing fields)

When the API service returns a `200 OK`, the transaction will eventually complete (even in the event of failure). The pending transactions are stored on a temporary database (Redis) and if the transaction service goes down, the service will continue from leftover pending transactions once it is restarted.

### Admin service
This service is placed separately from API service as I assume that this service is authenticated and only accessible to specific users. This admin service have 2 main features:

1. Viewing all transaction history
   * Pulls data from Redis Store as well as main database (eg. psql)
   * Parses data into a common form and display to admin user

2. Retrying a failed transaction
   * Admins can retry transactions that are eligilbe. These transactions are sent to the Transaction Service and the transaction status in Redis store is updated correspondingly


## Other design considerations
### Use of Redis and SQL DB
Pending transactions are stored in Redis Store, while failed transactions are stored in SQL DB. The main rationale behind this decision is the frequency of access and update to the data. Pending transactions are polled every 30s and updated as needed, hence a Redis Store is more efficient as data are stored in memory rather than disk.

Another potential benefit is that the data stored in Redis and main DB can be different. Redis Store stores information required for retrying, but main DB only needs to store transaction data that are necessary for viewing.

Alternatively, we could remove the need for a central database, by directly querying the blockchain network for historical transaction data.

### Scalability of Transaction Service
Transaction service is one of the service that might experience a severe performance bottleneck as the different services all make requests to this service. By making transaction service independent, we can scale this service independently based on the service load.

To handle communications from other services to this transaction service, we can place a load balancer in the middle to route requests to available service or we can use a message queue for communication between services. Any nodes that are free to take on a new requests can poll for 1 in the message queue. This allows for better concurrency and hence better responsiveness from the server.

