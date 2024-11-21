import bcrypt from "bcrypt";
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
        { status: 400 }
      );
    }


    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); 

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 401 }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Inicio de sesión exitoso",
        user: { id: user.id, email: user.email, name: user.name },
      }),
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
