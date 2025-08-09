import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import { getJwt } from "../utils/getJwt.js"; 

export const providerSignin = async (req, res) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Validate mandatory fields
        if (!email || !password) {
            return res.status(200).json({ error: "Email and password are required" });
        }

        // Check if the provider exists
        const provider = await prisma.provider.findUnique({
            where: { email },
            include: {
                address: true,
                orders:true,
                feedbacks:true
            }
        });

        if (!provider) {
            return res.status(200).json({ error: "Provider with this email does not exist" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, provider.password);

        if (!isPasswordValid) {
            return res.status(200).json({ error: "Invalid credentials" });
        }

        // Generate JWT token for the provider
        const token = getJwt(provider.id);

        // Respond with the provider and the token
        res.status(200).json({
            message: "Provider logged in successfully",
            provider,
            token,
        });
    } catch (error) {
        console.error("Error in providerSignin:", error);
        res.status(200).json({ error: "Internal server error" });
    }
};
