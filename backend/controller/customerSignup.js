import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { getJwt } from "../utils/getJwt.js";
import bcrypt from "bcrypt";

export const customerSignup = async (req, res) => {
    try {
        // Extract customer details from the request body
        const {
            firstName,
            lastName,
            dob,
            phoneNumber,
            email,
            photoLink,
            gender,
            password,
            houseNumber,
            streetName,
            state,
            country,
            pincode,
            longitude,
            latitude
        } = req.body;

        // Validate mandatory fields
        if (!firstName || !lastName || !dob || !phoneNumber || !email || !password || !houseNumber || !streetName || !state || !country || !pincode) {
            return res.status(200).json({ error: "All mandatory fields must be provided" });
        }

        // Check if the customer already exists
        const existingCustomer = await prisma.customer.findUnique({
            where: {
                email,
            },
        });

        if (existingCustomer) {
            return res.status(200).json({ error: "Customer with this email already exists" });
        }

        const existingCustomerByPhoneNumber = await prisma.customer.findUnique({
            where: {
                phoneNumber,  // Check if the phone number already exists
            },
        });
        
        if (existingCustomerByPhoneNumber) {
            return res.status(200).json({ error: "Customer with this phone number already exists" });
        }

        // Create or fetch the address
        
        const address = await prisma.address.create({
            data: {
                houseNumber,
                streetName,
                state,
                country,
                pincode,
                longitude: longitude || null,
                latitude: latitude || null,
            },
        });

        // Create the customer
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newCustomer = await prisma.customer.create({
            data: {
                firstName,
                lastName,
                dob: new Date(dob),
                phoneNumber,
                email,
                photoLink: photoLink || null,
                gender,
                password:hashedPassword, // Ensure to hash the password before storing it
                addressId: address.id,
            },
            include:{
                address: true,
                orders:true,
                feedbacks:true
            }
        });
        const token = getJwt(newCustomer.id);

        // Respond with the newly created customer
        res.status(201).json({ message: "Customer created successfully", customer: newCustomer, token });
    } catch (error) {
        console.error("Error in customerSignup:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
