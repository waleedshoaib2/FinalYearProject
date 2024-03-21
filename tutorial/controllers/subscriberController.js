import Subscribers from "../models/subscribers.js";

export const createSubscribers = async (req, res, next) => {
  const email = req.body.email;

  try {
    const existingSubscriber = await Subscribers.findOne({ email });

    if (existingSubscriber) {
      return res.send(
        "Email already subscribed. Check your email for the welcome newsletter."
      );
    }

    const newSubscriber = new Subscribers({ email });
    const savedSubscriber = await newSubscriber.save();
    console.log(`New subscription: ${email}`);

    const welcomeSubject = "Welcome to Our Newsletter!";
    let welcomeContent = "<p>Thank you for subscribing to our newsletter!</p>";
    welcomeContent += `<p><a href="${process.env.CLIENT_URL}/unsubscribe?email=${email}">Unsubscribe</a></p>`;
    sendNewsletter(email, welcomeSubject, welcomeContent);

    res.send(
      "Subscription successful! Check your email for a welcome newsletter."
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    next(error);
  }
};

export const deleteSubscribers = async (req, res, next) => {
  const email = req.body.email;

  try {
    const existingSubscriber = await Subscribers.findOne({ email });

    if (!existingSubscriber) {
      return res.send("Email not found. No action taken.");
    }

    const deletedSubscriber = await Subscribers.deleteOne({ email });
    console.log(`Subscription deleted: ${email}`);

    res.send("Unsubscription successful!");
  } catch (error) {
    console.error("Error deleting subscription:", error);
    next(error);
  }
};
