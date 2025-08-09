import amqp from 'amqplib';
import config from '../../utils/config/config.js';

const ProducerService = {
  sendMessage: async (queueMicrotask, message) => {
    const connection = await amqp.connect(config.rabbitMq.server);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueMicrotask, {
      durable: true,
    });

    await channel.sendToQueue(queueMicrotask, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

export default ProducerService;
