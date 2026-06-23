import React from "react";
import { useForm } from "@inertiajs/react";
import AuthCard from "../../components/AuthCard";

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    numero: "",
    name: "",
    dt_inicio: "",
    dt_termino: "",
  });

  function submit(e) {
    e.preventDefault();
    post("/edicoes");
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/edicao-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* ── DESKTOP ── */}
      <div
        className="relative z-10 hidden md:flex w-full min-h-screen"
        style={{ paddingTop: "8.6%", paddingBottom: "8.6%" }}
      >
        <div style={{ width: "5.63%", flexShrink: 0 }} />
        <div style={{ width: "44.22%", minHeight: "82.8vh", flexShrink: 0 }}>
          <AuthCard
            title="edição"
            fields={[
              { name: "numero", label: "Número da Edição", type: "text" },
              { name: "name",   label: "Nome",             type: "text" },
              { name: "dt_inicio",  label: "Data Início",  type: "date" },
              { name: "dt_termino", label: "Data Término", type: "date" },
            ]}
            data={data}
            setData={setData}
            errors={errors}
            onSubmit={submit}
            processing={processing}
            submitLabel="CADASTRAR"
            extraContent={
              <p style={{
                fontFamily: "'Glacial Indifference', sans-serif",
                fontSize: "clamp(0.7rem, 1.5vw, 1rem)",
                color: "#6425d8",
                textAlign: "center",
                lineHeight: 1.4,
                margin: "0.2rem 0",
              }}>
                Para adicionar membros ao secretariado e comitês, cadastre a edição, vá para sua visualização e clique em editar.
              </p>
            }
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
            title="edição"
            fields={[
              { name: "numero", label: "Número da Edição", type: "text" },
              { name: "name",   label: "Nome",             type: "text" },
              { name: "dt_inicio",  label: "Data Início",  type: "date" },
              { name: "dt_termino", label: "Data Término", type: "date" },
            ]}
            data={data}
            setData={setData}
            errors={errors}
            onSubmit={submit}
            processing={processing}
            submitLabel="CADASTRAR"
            extraContent={
              <p style={{
                fontFamily: "'Glacial Indifference', sans-serif",
                fontSize: "clamp(0.7rem, 3vw, 1rem)",
                color: "#6425d8",
                textAlign: "center",
                lineHeight: 1.4,
                margin: "0.2rem 0",
              }}>
                Para adicionar membros ao secretariado e comitês, cadastre a edição, vá para sua visualização e clique em editar.
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
}
