// api/signup.ts
import bcrypt from 'bcrypt'
import { supabase } from "../../lib/supabase";
import type { APIRoute } from "astro";

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; 
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

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
    // hash de la contraseña
    const nuevaPass= await hashPassword(password)

    // Insertar y obtener los datos insertados
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password:nuevaPass }])
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
