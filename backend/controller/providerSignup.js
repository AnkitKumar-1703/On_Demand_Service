import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { getJwt } from "../utils/getJwt.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../utils/config.js";

export const providerSignup = async (req, res) => {


  try {
    // Extract provider details from the request body
    let {
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
      latitude,
      workType,
      aadharNumber,
    } = req.body;

    

    // Validate mandatory fields
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !phoneNumber ||
      !email ||
      !password ||
      !houseNumber ||
      !streetName ||
      !state ||
      !country ||
      !pincode ||
      !workType ||
      !aadharNumber
    ) {
      console.log(req.body);
      
      return res
        .status(200)
        .json({ error: "All mandatory fields must be provided" });
    }

    latitude=Number.parseFloat(latitude);
    longitude=Number.parseFloat(longitude);

    // Check if the email is already registered
    const existingProviderByEmail = await prisma.provider.findUnique({
      where: {
        email, // Check if the email is already used by another provider
      },
    });

    if (existingProviderByEmail) {
      return res
        .status(200)
        .json({ error: "Provider with this email already exists" });
    }

    // Check if the Aadhar number is already used
    const existingProviderByAadhar = await prisma.provider.findUnique({
      where: {
        aadharNumber, // Correct check for the Aadhar number
      },
    });

    if (existingProviderByAadhar) {
      return res
        .status(200)
        .json({ error: "Provider with this Aadhar number already exists" });
    }
    
    const existingProviderByPhone = await prisma.provider.findUnique({
        where: {
          phoneNumber, // Check if the phone number is already used by another provider
        },
      });
      
      if (existingProviderByPhone) {
        return res
          .status(200)
          .json({ error: "Provider with this phone number already exists" });
      }


  //Checking image URL
    let image;

    if (req?.file) {
      try {
        const cloudinaryUrl = await uploadToCloudinary(req.file.path);
        image = cloudinaryUrl.secure_url;
        // console.log(image);
      } catch (err) {
        console.log(err);
      }
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

    // Create the provider
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newProvider = await prisma.provider.create({
      data: {
        firstName,
        lastName,
        dob: new Date(dob),
        phoneNumber,
        email,
        photoLink: photoLink || null,
        gender,
        password: hashedPassword, 
        addressId: address.id,
        workType,
        aadharNumber,
        photoLink:image
      },
      include: {
        address: true,
        orders:true,
        feedbacks:true
      },
    });

    const token = getJwt(newProvider.id);

    // Respond with the newly created provider
    res
      .status(201)
      .json({
        message: "Provider created successfully",
        provider: newProvider,
        token,
      });
  } catch (error) {
    console.error("Error in providerSignup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
