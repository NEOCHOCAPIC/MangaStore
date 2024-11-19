import { supabase } from "../../lib/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos" }),
        {
          status: 400,
        }
      );
    }

    // Verificar si el usuario existe en la tabla users
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 401 }
      );
    }

    // Verificar si la contraseña coincide (sin bcrypt)
    if (password !== data.password) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Inicio de sesión exitoso", user: data }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Error del servidor" }),
      { status: 500 }
    );
  }
};
