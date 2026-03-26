const SUPABASE_URL = "https://gqhgmalvclhufiwmleei.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pqUlpbTne_br-LYKcb-0ZA_9lHilDX9";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
async function register() {
  const email = prompt("Correo:");
  const password = prompt("Contraseña:");

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Cuenta creada");
  }
}

async function login() {
  const email = prompt("Correo:");
  const password = prompt("Contraseña:");

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Sesión iniciada");
  }
}






async function logout() {
  await supabaseClient.auth.signOut();
  alert("Sesión cerrada");
}

async function obtenerPost(slug) {

  let { data: post } = await supabaseClient
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) {
    const { data: nuevo } = await supabaseClient
      .from("posts")
      .insert([{ slug }])
      .select()
      .single();

    return nuevo;
  }

  return post;
}



async function mostrarLikes(slug) {

  const total = await contarLikes(slug);

  const el = document.getElementById("likes-" + slug);
  if (el) el.textContent = total;
}


async function contarLikes(slug) {

  const post = await obtenerPost(slug);

  const { count, error } = await supabaseClient
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id);

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}



async function darLike(slug) {

  const { data: userData } = await supabaseClient.auth.getUser();
  const user = userData.user;

  if (!user) {
    alert("Debes iniciar sesión");
    return;
  }

  const post = await obtenerPost(slug);

  // Verificar si ya dio like
  const { data: existente } = await supabaseClient
    .from("likes")
    .select("*")
    .eq("post_id", post.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existente) {
    alert("Ya diste like");
    return;
  }

  // Insertar like
  const { error } = await supabaseClient
    .from("likes")
    .insert([{
      post_id: post.id,
      user_id: user.id
    }]);

  if (error) {
    console.error(error);
    return;
  }

  // Actualizar contador
  mostrarLikes(slug);
}