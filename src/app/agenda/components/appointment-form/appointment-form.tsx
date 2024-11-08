"use client";

import { normalizePhoneNumber } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorMessage } from "@/components";

const appointmentFormSchema = z.object({
  name: z.string().min(1, { message: "Por favor, insira o seu nome." }),
  phone: z
    .string()
    .min(14, { message: "Por favor, insira um número de telefone válido." }),
});

type AppointmentFormInputs = z.infer<typeof appointmentFormSchema>;

export function AppointmentForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<AppointmentFormInputs>({
    mode: "onTouched",
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const data = watch();

  const { phone } = data;

  useEffect(() => {
    if (phone) setValue("phone", normalizePhoneNumber(phone));
  }, [phone, setValue]);

  const onSubmitForm: SubmitHandler<AppointmentFormInputs> = (data) => {
    const cleanedPhone = data.phone.replace(/\D/g, "");

    const cleanedData = {
      ...data,
      phone: cleanedPhone,
    };

    console.log(cleanedData);
  };

  return (
    <div className="flex-1 pl-6">
      <h2 className="text-xl font-bold mb-6"> Cadastro de Agendamento</h2>
      <p className="mb-6">
        Cadastrar agendamento para dia <strong>30/11/2024</strong> às{" "}
        <strong>15:00</strong>
      </p>

      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="w-full max-w-[400px] flex flex-col"
      >
        <div className="pb-8">
          <label htmlFor="name" className="block text-zinc-600 mb-2">
            Nome
          </label>
          <input
            className={`w-full border p-3 rounded-lg ${
              errors.name ? "border-red-500" : ""
            }`}
            type="text"
            id="name"
            placeholder="Ex.: Maria da Silva"
            autoComplete="name"
            {...register("name")}
          />
          <ErrorMessage error={errors.name?.message} />
        </div>
        <div className="pb-8">
          <label htmlFor="phone" className="block text-zinc-600 mb-2">
            Telefone ou WhatsApp
          </label>
          <input
            className={`w-full border p-3 rounded-lg ${
              errors.phone ? "border-red-500" : ""
            }`}
            id="phone"
            type="tel"
            placeholder="(51) 99999-9999"
            autoComplete="phone"
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
          <ErrorMessage error={errors.phone?.message} />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="relative flex-1 gap-1 bg-sky-200 p-3 rounded-lg text-center font-semibold hover:bg-sky-300 disabled:bg-slate-300 transition"
          >
            <CaretLeft className="absolute size-6" /> Voltar
          </button>
          <button
            type="submit"
            className="flex-1 bg-sky-500 p-3 rounded-lg text-white text-center font-semibold hover:bg-sky-600 disabled:bg-slate-300 transition"
            disabled={!isValid}
          >
            Agendar
          </button>
        </div>
      </form>
    </div>
  );
}
