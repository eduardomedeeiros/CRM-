import { NextResponse } from "next/server";
import { NOME_COOKIE, tokenValido } from "./lib/sessao";

// O porteiro: roda antes de qualquer página ou ação. Sem login válido, vai para /login.
export function proxy(request) {
  if (tokenValido(request.cookies.get(NOME_COOKIE)?.value)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

// Vale para tudo, menos as telas de login e cadastro e os arquivos internos do Next.js.
export const config = {
  matcher: ["/((?!login|cadastro|_next/static|_next/image|favicon.ico).*)"],
};
