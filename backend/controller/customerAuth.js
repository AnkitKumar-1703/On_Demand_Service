import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import express from "express";
import verifyJwt from "../middleware/verifyJwt.js";
import calcDistance from "../utils/calculateDistance.js";
import { completedOrder, createOrder, deleteOrder, reOpenOrder } from "./order.js";
const router = express.Router();

router.use(verifyJwt);


// Add this route after the existing routes

// this route will provide all the customers in the database (for admin use)
router.get("/bulkcustomer", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        address: true,
        feedbacks: true,
        orders: {
          include: {
            doneBy: true,
          },
        },
        favorites: {
          include: {
            provider: true,
          },
        },
      },
    });

    const formattedCustomers = customers.map((customer) => {
      // Format address
      const { houseNumber, streetName, state, country, pincode } = customer.address || {};
      const formattedAddress = customer.address 
        ? `${houseNumber}, ${streetName}, ${state}, ${country} - ${pincode}`
        : "No address provided";

      // Calculate customer age
      const customerAge = customer.dob 
        ? new Date().getFullYear() - new Date(customer.dob).getFullYear()
        : null;

      // Calculate total orders and completed orders
      const totalOrders = customer.orders.length;
      const completedOrders = customer.orders.filter(order => order.completed).length;
      const pendingOrders = customer.orders.filter(order => !order.completed).length;

      // Get favorite providers count
      const favoriteProvidersCount = customer.favorites.length;

      // Calculate average feedback given by customer
      let averageFeedbackGiven = 0;
      if (customer.feedbacks.length > 0) {
        averageFeedbackGiven = customer.feedbacks.reduce((acc, feedback) => acc + feedback.star, 0) / customer.feedbacks.length;
        averageFeedbackGiven = Math.round(averageFeedbackGiven * 100) / 100;
      }

      return {
        customerId: customer.id,
        customerName: customer.firstName + " " + customer.lastName,
        customerEmail: customer.email,
        customerPhone: customer.phoneNumber,
        customerAge: customerAge,
        customerGender: customer.gender,
        customerAddress: formattedAddress,
        customerCreatedAt: customer.createdAt,
        customerUpdatedAt: customer.updatedAt,
        totalOrders: totalOrders,
        completedOrders: completedOrders,
        pendingOrders: pendingOrders,
        favoriteProvidersCount: favoriteProvidersCount,
        averageFeedbackGiven: averageFeedbackGiven,
        photoLink: customer.photoLink,
        isActive: customer.id ? true : false, // You can add an 'active' field to your schema if needed
      };
    });

    // Sort customers by creation date (newest first)
    formattedCustomers.sort((a, b) => new Date(b.customerCreatedAt) - new Date(a.customerCreatedAt));

    res.status(200).json({
      customers: formattedCustomers,
      totalCount: formattedCustomers.length,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      error: "An error occurred while fetching customers.",
      details: error.message,
    });
  }
});




// this route will provide the detail of a customer
router.get("/profile", async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: req.userId,
      },
      include: {
        address: true,
        favorites: {
          include: {
            provider: {
              include: {
                address: true,
              },
            },
          },
        },
        feedbacks: true,
        orders: {
          include: {
            doneBy: true,
          },
        },
      },
    });
    customer.password = undefined;
    res.status(200).json({
      customer,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      error: "An error occurred while fetching customer profile.",
    });
  }
});

// this route will provide all the providers in the database
router.get("/bulkprovider", async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: req.userId,
    },
    include: {
      address: true,
    },
  });
  const providers = await prisma.provider.findMany({
    // where: {
    //   available: true,
    // },
    include: {
      address: true,
      feedbacks: true,
    },
  });
  const newProvider = providers.map((provider) => {
    let rating =
      provider.feedbacks.reduce((acc, feedback) => acc + feedback.star, 0) /
      provider.feedbacks.length;
    // rating not a number
    if (isNaN(rating)) {
      rating = 0;
    } else {
      rating = Math.round(rating * 100) / 100;
      rating = Math.max(rating, 0); // Ensure rating is not negative
      rating = Math.min(rating, 5); // Ensure rating does not exceed 5
    }
    const { houseNumber, streetName, state, country, pincode } =
      provider.address;
    const formattedAddress = `${houseNumber}, ${streetName}, ${state}, ${country} - ${pincode}`;
    return {
      providerId: provider.id,
      providerName: provider.firstName + " " + provider.lastName,
      providerAge:
        new Date().getFullYear() - new Date(provider.dob).getFullYear(),
      providerGender: provider.gender,
      providerPhone: provider.phoneNumber,
      providerWorkType: provider.workType,
      providerStatus: provider.available,
      providerDistanceInKm: calcDistance(
        customer.address.latitude,
        customer.address.longitude,
        provider.address.latitude,
        provider.address.longitude
      ),
      providerRating: rating,
      providerFeedback: provider.feedbacks,
      providerAddress: formattedAddress,
      providerEmail: provider.email,
      photoLink: provider.photoLink,
    };
  });
  newProvider.forEach(provider => {
    provider.providerNewDistanceInKm = provider.providerDistanceInKm - (2 * provider.providerRating);
  });
  // sort the provider by distance
  newProvider.sort((a, b) => a.providerNewDistanceInKm - b.providerNewDistanceInKm);
  res.status(200).json({
    provider: newProvider,
  });
});

// this route will provide filtered results based on the customer's requirement
router.get("/filterprovider", async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: req.userId,
    },
    include: {
      address: true,
    },
  });
  const { workType, distance, rating } = req.query;
  let providers = await prisma.provider.findMany({
    where: {
      // available: true,
    },
    include: {
      address: true,
      feedbacks: true,
    },
  });
  // if workType is provided in the query and workType is an array that means multiple workType is provided if not then single workType will be empty array
  if (workType && workType.length > 0) {
    providers = providers.filter((provider) =>
      workType.includes(provider.workType)
    );
  }

  // if distance is provided in the query
  if (distance) {
    providers = providers.filter(
      (provider) =>
        calcDistance(
          customer.address.latitude,
          customer.address.longitude,
          provider.address.latitude,
          provider.address.longitude
        ) <= distance
    );
  }
  // if rating is provided in the query
  if (rating) {
    providers = providers.filter((provider) => {
      let star =
        provider.feedbacks.reduce((acc, feedback) => acc + feedback.star, 0) /
        provider.feedbacks.length;
      // star not a number
      if (isNaN(star)) {
        star = 0;
      } else {
        star = Math.round(star * 100) / 100;
        star = Math.max(star, 0); // Ensure rating is not negative
        star = Math.min(star, 5); // Ensure rating does not exceed 5
      }
      return star >= rating;
    });
  }
  const newProvider = providers.map((provider) => {
    let rating =
      provider.feedbacks.reduce((acc, feedback) => acc + feedback.star, 0) /
      provider.feedbacks.length;
    // rating not a number
    if (isNaN(rating)) {
      rating = 0;
    } else {
      rating = Math.round(rating * 100) / 100;
      rating = Math.max(rating, 0); // Ensure rating is not negative
      rating = Math.min(rating, 5); // Ensure rating does not exceed 5
    }
    const { houseNumber, streetName, state, country, pincode } =
      provider.address;
    const formattedAddress = `${houseNumber}, ${streetName}, ${state}, ${country} - ${pincode}`;
    return {
      providerId: provider.id,
      providerName: provider.firstName + " " + provider.lastName,
      providerAge:
        new Date().getFullYear() - new Date(provider.dob).getFullYear(),
      providerGender: provider.gender,
      providerPhone: provider.phoneNumber,
      providerWorkType: provider.workType,
      providerStatus: provider.available,
      providerDistanceInKm: calcDistance(
        customer.address.latitude,
        customer.address.longitude,
        provider.address.latitude,
        provider.address.longitude
      ),
      providerRating: rating,
      providerFeedback: provider.feedbacks,
      providerAddress: formattedAddress,
      providerEmail: provider.email,
      photoLink: provider.photoLink,
    };
  });
  // sort the provider by distance
  newProvider.forEach(provider => {
    provider.providerNewDistanceInKm = provider.providerDistanceInKm - (2 * provider.providerRating);
  });
  newProvider.sort((a, b) => a.providerNewDistanceInKm - b.providerNewDistanceInKm);
  res.status(200).json({
    provider: newProvider,
  });
});

// this route will provide the search result based on the customer's search query
router.get("/searchprovider", async (req, res) => {
  try {
    const { keyword, fav } = req.query;
    const customer = await prisma.customer.findUnique({
      where: {
        id: req.userId,
      },
      include: {
        address: true,
        favorites: true,
      },
    });
    // Extract provider IDs from favorites
    const favoriteProviderIds = customer.favorites.map((fav) => fav.providerId);

    // Define provider filter conditionally based on fav parameter
    const providerFilter =
      fav === "true" ? { id: { in: favoriteProviderIds } } : {};

    const providers = await prisma.provider.findMany({
      where: {
        ...providerFilter, // Apply favorite filter only if fav=true
        OR: [
          { firstName: { contains: keyword, mode: "insensitive" } },
          { lastName: { contains: keyword, mode: "insensitive" } },
          { workType: { contains: keyword, mode: "insensitive" } },
          {
            address: {
              OR: [
                { streetName: { contains: keyword, mode: "insensitive" } },
                { state: { contains: keyword, mode: "insensitive" } },
                { country: { contains: keyword, mode: "insensitive" } },
              ],
            },
          },
        ],
      },
      include: {
        address: true,
        feedbacks: true,
      },
    });

    const newProvider = providers.map((provider) => {
      let rating =
        provider.feedbacks.reduce((acc, feedback) => acc + feedback.star, 0) /
        provider.feedbacks.length;
      // rating not a number
      if (isNaN(rating)) {
        rating = 0;
      } else {
        rating = Math.round(rating * 100) / 100;
        rating = Math.max(rating, 0); // Ensure rating is not negative
        rating = Math.min(rating, 5); // Ensure rating does not exceed 5
      }
      const { houseNumber, streetName, state, country, pincode } =
        provider.address;
      const formattedAddress = `${houseNumber}, ${streetName}, ${state}, ${country} - ${pincode}`;
      return {
        providerId: provider.id,
        providerName: provider.firstName + " " + provider.lastName,
        providerAge:
          new Date().getFullYear() - new Date(provider.dob).getFullYear(),
        providerGender: provider.gender,
        providerPhone: provider.phoneNumber,
        providerWorkType: provider.workType,
        providerStatus: provider.available,
        providerDistanceInKm: calcDistance(
          customer.address.latitude,
          customer.address.longitude,
          provider.address.latitude,
          provider.address.longitude
        ),
        providerRating: rating,
        providerFeedback: provider.feedbacks,
        providerAddress: formattedAddress,
        providerEmail: provider.email,
        photoLink: provider.photoLink,
      };
    });
    // sort the provider by distance
    newProvider.forEach(provider => {
      provider.providerNewDistanceInKm = provider.providerDistanceInKm - (2 * provider.providerRating);
    });
    newProvider.sort((a, b) => a.providerNewDistanceInKm - b.providerNewDistanceInKm);
    res.status(200).json({
      provider: newProvider,
    });
  } catch (error) {
    res.status(200).json({
      error: "An error occurred while fetching search result.",
    });
  }
});

// this route will provide order history detail of a customer
router.get("/orderhistory", async (req, res) => {
  const orders = await prisma.order.findMany({
    where: {
      askedById: req.userId,
    },
    include: {
      doneBy: true,
      feedback: true,
    },
  });
  // console.log(orders);

  const newOrders = orders.map((order) => {
    return {
      orderId: order.id,
      orderDate: order.createdAt,
      orderCompleted: order.completed,
      orderFeedback: order.feedback?.feedback ?? "No feedback yet",
      orderRating: order.feedback?.star ?? 0,
      orderTitle: order.taskName,
      orderDescription: order.description,
      orderState: order.state,
      providerName: order.doneBy.firstName + " " + order.doneBy.lastName,
      providerPhone: order.doneBy.phoneNumber,
      providerWorkType: order.doneBy.workType,
      providerEmail: order.doneBy.email,
    };
  });
  
  // Sort orders by priority state first, then by date
newOrders.sort((a, b) => {
  // Define priority for each state
  const getPriority = (state) => {
    if (state === "AVAILABLE") return 0;
    if (state === "PENDING") return 1;
    return 2; // All other states
  };

  // Get priorities
  const priorityA = getPriority(a.orderState);
  const priorityB = getPriority(b.orderState);

  // First sort by priority
  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }
  
  // If same priority, sort by date (newest first)
  return new Date(b.orderDate) - new Date(a.orderDate);
});
  res.status(200).json({
    orders: newOrders,
  });
});

// this route will provide the detail of favorite providers of a customer
router.get("/favoriteprovider", async (req, res) => {
  try {
    const customer = await prisma.favorite.findMany({
      where: {
        customerId: req.userId,
      },
      include: {
        provider: {
          include: {
            address: true,
            feedbacks: true,
          },
        },
      },
    });

    const newCustomer = customer.map((customer) => {
      const { houseNumber, streetName, state, country, pincode } =
        customer.provider.address;
      const formattedAddress = `${houseNumber}, ${streetName}, ${state}, ${country} - ${pincode}`;
      let rating =
        customer.provider.feedbacks.reduce(
          (acc, feedback) => acc + feedback.star,
          0
        ) / customer.provider.feedbacks.length;
      if (isNaN(rating)) {
        rating = 0;
      } else {
        rating = Math.round(rating * 100) / 100;
        rating = Math.max(rating, 0); // Ensure rating is not negative
        rating = Math.min(rating, 5); // Ensure rating does not exceed 5
      }
      return {
        providerId: customer.provider.id,
        providerName:
          customer.provider.firstName + " " + customer.provider.lastName,
        providerAge:
          new Date().getFullYear() -
          new Date(customer.provider.dob).getFullYear(),
        providerGender: customer.provider.gender,
        providerPhone: customer.provider.phoneNumber,
        providerWorkType: customer.provider.workType,
        providerStatus: customer.provider.available,
        providerAddress: formattedAddress,
        providerEmail: customer.provider.email,
        providerRating: rating,
        photoLink: customer.provider.photoLink,
      };
    });

    res.status(200).json({
      favorite: newCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      error: "An error occurred while fetching favorite providers.",
    });
  }
});

// this route will add a provider to the favorite list of a customer
router.post("/favoriteprovider", async (req, res) => {
  try {
    const { providerId } = req.body;
    const provider = await prisma.favorite.findFirst({
      where: {
        customerId: req.userId,
        providerId: providerId,
      },
    });
    if (provider) {
      return res.status(200).json({
        error: "Provider already in favorite list.",
      });
    }
    const customer = await prisma.favorite.create({
      data: {
        customerId: req.userId,
        providerId: providerId,
      },
    });

    res.status(200).json({
      message: "Provider added to favorite list.",
      favorite: customer,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      error: "An error occurred while adding provider to favorite list.",
    });
  }
});

// this route will remove a provider from the favorite list of a customer
router.delete("/favoriteprovider", async (req, res) => {
  try {
    const { providerId } = req.body;
    const customer = await prisma.favorite.deleteMany({
      where: {
        customerId: req.userId,
        providerId: providerId,
      },
    });

    res.status(200).json({
      message: "Provider removed from favorite list.",
      favorite: customer,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      error: "An error occurred while removing provider from favorite list.",
    });
  }
});

// this route will create an order by the customer
router.post("/createOrder",createOrder);

// this route will mark the order as completed by the customer
router.patch("/markCompletedOrder",completedOrder);

// this route will mark the order as pending if the customer is not satisfied with the provider work
// router.patch("/reOpenOrder",reOpenOrder);

// this route will delete the order by the customer
router.delete("/deleteOrder", deleteOrder); 

// Make sure you have this route

router.delete("/deletecustomer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    console.log("Attempting to delete customer with ID:", customerId);
    
    if (!customerId || isNaN(customerId)) {
      return res.status(400).json({ error: "Valid Customer ID is required" });
    }

    const customerIdInt = parseInt(customerId);

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerIdInt },
    });

    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Delete the customer (assuming cascade delete is set up in your schema)
    await prisma.customer.delete({
      where: { id: customerIdInt },
    });

    console.log("Customer deleted successfully:", customerIdInt);
    
    res.status(200).json({
      message: "Customer deleted successfully",
      deletedCustomerId: customerIdInt,
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({
      error: "An error occurred while deleting the customer",
      details: error.message,
    });
  }
});

export default router;
