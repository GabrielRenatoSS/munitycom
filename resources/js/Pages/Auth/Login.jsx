import React from "react";
import { useForm } from "@inertiajs/react";
import AuthCard from "../../components/AuthCard";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    username: "",
    password: "",
  });

  function submit(e) {
    e.preventDefault();
    post("/login");
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/login-bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* ── DESKTOP ── */}
      <div
        className="relative z-10 hidden md:flex w-full min-h-screen"
        style={{ paddingTop: "8.6%", paddingBottom: "8.6%" }}
      >
        {/* Left spacer: 5.63% */}
        <div style={{ width: "5.63%", flexShrink: 0 }} />

        {/* Card: 44.22% largura, 82.8vh altura */}
        <div style={{ width: "44.22%", minHeight: "82.8vh", flexShrink: 0 }}>
          <AuthCard
            title="conecte-se"
            fields={[
              { name: "username", label: "Username", type: "text" },
              { name: "password", label: "Senha", type: "password" },
            ]}
            data={data}
            setData={setData}
            errors={errors}
            onSubmit={submit}
            processing={processing}
            submitLabel="ENTRAR"
            links={[
              { sublabel: "Não tem uma conta?", label: "CADASTRE-SE", href: "/register" },
              { sublabel: "Esqueceu sua senha?", label: "RECUPERE", href: "/forgot-password" },
            ]}
          />
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div
        className="relative z-10 flex md:hidden w-full min-h-screen items-center justify-center"
            style={{
            paddingTop: "24.1%",
            paddingBottom: "24.1%",
            paddingLeft: "6.2%",
            paddingRight: "6.2%",
            }}
      >
        <div className="w-full">
          <AuthCard
            title="conecte-se"
            fields={[
              { name: "username", label: "Username", type: "text" },
              { name: "password", label: "Senha", type: "password" },
            ]}
            data={data}
            setData={setData}
            errors={errors}
            onSubmit={submit}
            processing={processing}
            submitLabel="ENTRAR"
            links={[
              { sublabel: "Não tem uma conta?", label: "CADASTRE-SE", href: "/register" },
              { sublabel: "Esqueceu sua senha?", label: "RECUPERE", href: "/forgot-password" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
