// api/signup.ts
import { supabase } from "../../lib/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validar que todos los campos estén presentes
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Todos los campos son requeridos"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Insertar y obtener los datos insertados
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: data
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido"
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
