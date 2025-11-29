"use server";

import { z } from "zod";
import { logger } from "@/lib/logger";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres."),
});

export type ContactFormState = {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  message?: string;
};

const SIMULATED_DELAY_MS = 1000;

export async function submitContactForm(
  prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación.",
    };
  }

  try {
    // Here you would typically send the data to your backend, e.g., Firebase.
    // For this example, we'll just log it and simulate success.
    logger.info("Form data submitted:", validatedFields.data);

    // Simulate database operation
    await new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    
    return {
      success: true,
      message: "¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.",
    };

  } catch (error) {
    // Log error in development for debugging
    if (error instanceof Error) {
      logger.error("Contact form error:", error.message);
    }
    
    return {
      success: false,
      message: "Algo salió mal. Por favor, inténtalo de nuevo.",
    };
  }
}
