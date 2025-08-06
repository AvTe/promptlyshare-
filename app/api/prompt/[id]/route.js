import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { getAuthenticatedUser, validateOwnership, createSecureResponse } from "@utils/auth";
import { validatePrompt, validateTag, validateObjectId, createErrorResponse } from "@utils/validation";

export const GET = async (request, { params }) => {
    try {
        // Validate ID format
        const idValidation = validateObjectId(params.id);
        if (!idValidation.isValid) {
            return createErrorResponse(`Invalid ID: ${idValidation.errors.join(', ')}`, 400);
        }

        await connectToDB();

        const prompt = await Prompt.findById(params.id).populate("creator");
        if (!prompt) {
            return createErrorResponse("Prompt not found", 404);
        }

        return createSecureResponse(prompt, 200);
    } catch (error) {
        console.error("Error fetching prompt:", error);
        return createErrorResponse("Internal server error", 500);
    }
};

export const PATCH = async (request, { params }) => {
    try {
        // Check authentication
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return createErrorResponse("Authentication required", 401);
        }

        // Validate ID format
        const idValidation = validateObjectId(params.id);
        if (!idValidation.isValid) {
            return createErrorResponse(`Invalid ID: ${idValidation.errors.join(', ')}`, 400);
        }

        // Parse and validate request body
        let body;
        try {
            body = await request.json();
        } catch (error) {
            return createErrorResponse("Invalid JSON format", 400);
        }

        const { prompt, tag } = body;

        // Validate input
        const promptValidation = validatePrompt(prompt);
        if (!promptValidation.isValid) {
            return createErrorResponse(`Prompt validation failed: ${promptValidation.errors.join(', ')}`, 400);
        }

        const tagValidation = validateTag(tag);
        if (!tagValidation.isValid) {
            return createErrorResponse(`Tag validation failed: ${tagValidation.errors.join(', ')}`, 400);
        }

        await connectToDB();

        // Find the existing prompt by ID
        const existingPrompt = await Prompt.findById(params.id);
        if (!existingPrompt) {
            return createErrorResponse("Prompt not found", 404);
        }

        // Check ownership
        if (!validateOwnership(user.id, existingPrompt.creator)) {
            return createErrorResponse("Unauthorized: You can only edit your own prompts", 403);
        }

        // Update the prompt with sanitized data
        existingPrompt.prompt = promptValidation.sanitized;
        existingPrompt.tag = tagValidation.sanitized;

        await existingPrompt.save();

        return createSecureResponse("Successfully updated the prompt", 200);
    } catch (error) {
        console.error("Error updating prompt:", error);
        return createErrorResponse("Internal server error", 500);
    }
};

export const DELETE = async (request, { params }) => {
    try {
        // Check authentication
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return createErrorResponse("Authentication required", 401);
        }

        // Validate ID format
        const idValidation = validateObjectId(params.id);
        if (!idValidation.isValid) {
            return createErrorResponse(`Invalid ID: ${idValidation.errors.join(', ')}`, 400);
        }

        await connectToDB();

        // Find the prompt to check ownership before deletion
        const existingPrompt = await Prompt.findById(params.id);
        if (!existingPrompt) {
            return createErrorResponse("Prompt not found", 404);
        }

        // Check ownership
        if (!validateOwnership(user.id, existingPrompt.creator)) {
            return createErrorResponse("Unauthorized: You can only delete your own prompts", 403);
        }

        // Delete the prompt
        await Prompt.findByIdAndDelete(params.id);

        return createSecureResponse("Prompt deleted successfully", 200);
    } catch (error) {
        console.error("Error deleting prompt:", error);
        return createErrorResponse("Internal server error", 500);
    }
};