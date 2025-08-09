import { PrismaClient,OrderState } from "@prisma/client";
const prisma = new PrismaClient();

// order created by the customer
export const createOrder = async (req, res) => {
    try {
        const {name,description,providerId} = req.body;
        if (!name || !description || !providerId) {
            return res.status(200).json({ error: "All mandatory fields must be provided" });
        }
        const order = await prisma.order.create({
            data: {
                taskName: name,
                description: description,
                doneById: providerId,
                askedById: req.userId,
                state: OrderState.AVAILABLE,
            }
        }); 
        res.status(200).json({order});
    
    } catch (error) {
        res.status(200).json({ error: "Internal Server Error" });
    }
}

// order accepted by provider
export const acceptOrder = async (req, res) => {
    try {
        const {orderId} = req.body;
        if (!orderId) {
            return res.status(200).json({ error: "All mandatory fields must be provided" });
        }
        
        // Use a transaction to ensure both the order update and chat creation succeed or fail together
        const result = await prisma.$transaction(async (prismaClient) => {
            // First update the order status
            const order = await prismaClient.order.update({
                where: {
                    id: orderId,
                    doneById: req.providerId,
                    state: OrderState.AVAILABLE,
                },
                data: {
                    state: OrderState.PENDING,
                }
            });
            
            // Then create a new chat for this order with empty messages
            const chat = await prismaClient.chat.create({
                data: {
                    taskId: orderId,
                    messages: [] // Empty array for messages
                }
            });
            
            return { order, chat };
        });
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in acceptOrder:", error);
        res.status(200).json({ error: "Internal Server Error" });
    }
}

// order marked completed by the provider
export const completeOrder = async (req, res) =>{
    try {
        const {orderId} = req.body;
        if (!orderId) {
            return res.status(200).json({ error: "All mandatory fields must be provided" });
        }
        const order = await prisma.order.update({
            where: {
                id: orderId,
                doneById: req.providerId,
                state: OrderState.PENDING,
            },
            data: {
                state: OrderState.COMPLETED,
            }
        });
        res.status(200).json({order});
    } catch (error) {
        res.status(200).json({ error: "Internal Server Error" });
    }
}

// order marked completed by the customer
export const completedOrder = async (req, res) => {
    try {
        const {orderId, rating, feedback} = req.body;
        if (!orderId || !rating || !feedback) {
            return res.status(200).json({ error: "All mandatory fields must be provided" });
        }
        
        // First check if the order exists and is in the right state
        const existingOrder = await prisma.order.findUnique({
            where: {
                id: orderId,
                askedById: req.userId, // Ensure the user owns this order
                state: {in:[OrderState.PENDING, OrderState.COMPLETED]} // Only pending orders can be completed
            }
        });
        
        if (!existingOrder) {
            return res.status(200).json({ error: "Order not found or not in the right state" });
        }
        
        // Update the order
        const order = await prisma.order.update({
            where: {
                id: orderId,
                askedById: req.userId
            },
            data: {
                state: OrderState.COMPLETED,
                completed: true,
            }
        });
        
        // Create the feedback with converted rating to ensure it's a number
        const orderFeedback = await prisma.feedback.create({
            data: {
                orderId: orderId,
                star: Number(rating),
                feedback: feedback,
                givenById: req.userId,
                givenToId: existingOrder.doneById, // Use the validated order
            }
        });
        
        res.status(200).json({order, orderFeedback});
    } catch (error) {
        console.error("Error in completedOrder:", error); // Log the actual error
        res.status(200).json({ error: "Internal Server Error while giving feedback." });
    }
}

// if the customer not satisfied with the work done by the provider (for the customer)
// provider can re-open the order
export const reOpenOrder = async (req, res) => {
    try {
        const {orderId} = req.body;
        if (!orderId) {
            return res.status(200).json({ error: "All mandatory fields must be provided" });
        }
        const order = await prisma.order.update({
            where: {
                id: orderId,
                state: OrderState.COMPLETED,
                doneById: req.providerId,
            },
            data: {
                state: OrderState.PENDING,
            }
        });
        res.status(200).json({order});
    } catch (error) {
        res.status(200).json({ error: "Internal Server Error" });
    }
}

// order rejected by the provider
export const rejectOrder = async (req, res) => {
    try {
        const {orderId} = req.body;
        if (!orderId) {
            return res.status(200).json({ error: "All mandatory fields must be provided" });
        }
        const order = await prisma.order.update({
            where: {
                id: orderId,
                doneById: req.providerId,
                state: OrderState.AVAILABLE,
            },
            data: {
                state: OrderState.REJECTED,
            }
        });
        res.status(200).json({order});
    } catch (error) {
        res.status(200).json({ error: "Internal Server Error" });
    }
}

// order deleted by the customer
export const deleteOrder = async (req, res) => {
    try {
        const {orderId} = req.body;
        if (!orderId) {
            return res.status(200).json({ error: "All mandatory fields must be provided" });
        }
        // console.log(req.userId);
        
        const order = await prisma.order.delete({
            where: {
                id: orderId,
                askedById: req.userId,
                state: {in:[OrderState.PENDING, OrderState.AVAILABLE]}

            }
        }); 
        res.status(200).json({order});
    
    } catch (error) {
        res.status(200).json({ error: "Internal Server Error while deleting the order" });
    }
}