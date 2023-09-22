import { app } from './app'
import { validatedEnv } from './env'

app.listen({
  host: '0.0.0.0',
  port: validatedEnv.PORT,
}).then(() => {
  console.log('🚀 HTTP Server Running')
})


const topicNameOrId = 'projects/fastify-pub-sub/topics/MyTopic';
const data = JSON.stringify({ teste: 'teste' });
const projectId = 'fastify-pub-sub' // Your Google Cloud Platform project ID

// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');



// Creates a client; cache this for further use
const pubSubClient = new PubSub({ projectId, credentials });

async function publishMessage(topicNameOrId: any, data: any) {
  // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
  const dataBuffer = Buffer.from(data);

  try {
    const messageId = await pubSubClient
      .topic(topicNameOrId)
      .publishMessage({ data: dataBuffer });
    console.log(`Message ${messageId} published.`);
  } catch (error: any) {
    console.error(`Received error while publishing: ${error.message}`);
    process.exitCode = 1;
  }
}

/////////////

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const subscriptionNameOrId = 'projects/fastify-pub-sub/subscriptions/MySub';
const timeout = 60;

function listenForMessages(subscriptionNameOrId: any, timeout: any) {

  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionNameOrId);
  const data = JSON.stringify({ integrated: 1 });
  const dataBuffer = Buffer.from(data);
  const topicoInteger = 'projects/fastify-pub-sub/topics/MyInteger'

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message: any) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();

    publishMessage(topicoInteger, dataBuffer)

  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  // Wait a while for the subscription to run. (Part of the sample only.)
  // setTimeout(() => {
  //   subscription.on('message', messageHandler);
  //   // subscription.removeListener('message', messageHandler);
  //   // console.log(`${messageCount} message(s) received.`);
  // }, timeout * 1000);
}

// publishMessage(topicNameOrId, data)
listenForMessages(subscriptionNameOrId, timeout)