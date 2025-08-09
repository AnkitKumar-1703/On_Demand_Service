import { PrismaClient,OrderState } from "@prisma/client";
const prisma = new PrismaClient();

export const updateChat= async (req, res) => {
    try {
        const { taskId, message } = req.body;
        if (!taskId || !message) {
            return res.status(400).json({ error: "Chat ID and message are required" });
        }

        const existingChat = await prisma.chat.findUnique({
            where: { taskId: taskId },
        });
        if (!existingChat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        // Update the chat with the new message
        const messages = existingChat.messages || [];
        const updatedMessages =[...messages,message]

        const updatedChat = await prisma.chat.update({
            where: { taskId: taskId },
            data: {
                messages: updatedMessages,
        },
        });
        if (!updatedChat) {
            return res.status(500).json({ error: "Failed to update chat" });
        }


        res.status(200).json({success:true, chat: updatedChat });
    } catch (error) {
        console.error("Error updating chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getChatByTaskId = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        const chat = await prisma.chat.findUnique({
            where: { taskId: taskId },
        });

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        res.status(200).json({ chat });
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};