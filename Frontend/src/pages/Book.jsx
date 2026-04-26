import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Section from "../components/Section";
import { requestPermission, notifyBookingConfirmed, scheduleReminder } from "../lib/notifications";
import { listLocations, seedIfEmpty, uid } from "../lib/storage";
import { createBooking } from "../lib/bookingsApi";

export default function Book() {
  const { t } = useTranslation();

  const vehicleOpts = useMemo(() => {
    const values = t("book.opts.vehicle", { returnObjects: true });
    return Array.isArray(values) ? values : [];
  }, [t]);
  const serviceOpts = useMemo(() => {
    const values = t("book.opts.service", { returnObjects: true });
    return Array.isArray(values) ? values : [];
  }, [t]);
  const timeOpts = useMemo(() => {
    const values = t("book.opts.time", { returnObjects: true });
    return Array.isArray(values) ? values : [];
  }, [t]);
  const locations = useMemo(() => listLocations(), []);

  const schema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(2, t("errors.name", { defaultValue: "Name is required" })),
        email: z.string().email(t("errors.email", { defaultValue: "Enter a valid email" })),
        phone: z.string().min(6, t("errors.phone", { defaultValue: "Enter a valid phone" })),
        vehicle: z.string().min(1, t("errors.vehicle", { defaultValue: "Select a vehicle" })),
        locationId: z.string().min(1, "Select a location"),
        service: z.string().min(1, t("errors.service", { defaultValue: "Select a service" })),
        date: z.string().min(1, t("errors.date", { defaultValue: "Select a date" })),
        time: z.string().min(1, t("errors.time", { defaultValue: "Select a time" })),
        notes: z.string().optional(),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      vehicle: "",
      locationId: locations[0]?.id || "loc_1",
      service: "",
      date: "",
      time: "",
      notes: "",
    },
  });

  const FieldError = ({ name }) =>
    errors[name]?.message ? <p className="mt-1 text-sm text-rose-600">{String(errors[name]?.message)}</p> : null;

  const onSubmit = async (data) => {
    seedIfEmpty();
    const id = uid("BKG");

    const booking = {
      id,
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      vehicle: data.vehicle,
      locationId: data.locationId,
      service: data.service,
      date: data.date,
      time: data.time,
      notes: data.notes || "",
      status: "pending",
      at: Date.now(),
    };

    await createBooking(booking);

    await requestPermission();
    notifyBookingConfirmed({
      name: data.fullName,
      phone: data.phone,
      service: data.service,
      date: data.date,
      time: data.time,
    });
    scheduleReminder({
      id,
      name: data.fullName,
      phone: data.phone,
      service: data.service,
      date: data.date,
      time: data.time,
    });

    reset();
  };

  return (
    <div>
      <Section title={t("book.title")} subtitle={t("book.subtitle")}>
        <div className="card mx-auto max-w-3xl p-8">
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.fullName")}</label>
                <input
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("fullName")}
                  placeholder={t("contact.placeholders.name")}
                />
                <FieldError name="fullName" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.email")}</label>
                <input
                  type="email"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("email")}
                  placeholder={t("contact.placeholders.email")}
                />
                <FieldError name="email" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.phone")}</label>
                <input
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("phone")}
                  placeholder={t("contact.placeholders.phone")}
                />
                <FieldError name="phone" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.vehicle")}</label>
                <select
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("vehicle")}
                >
                  {vehicleOpts.map((option, index) => (
                    <option key={option || index} value={index === 0 ? "" : option}>
                      {option}
                    </option>
                  ))}
                </select>
                <FieldError name="vehicle" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.service")}</label>
                <select
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("service")}
                >
                  {serviceOpts.map((option, index) => (
                    <option key={option || index} value={index === 0 ? "" : option}>
                      {option}
                    </option>
                  ))}
                </select>
                <FieldError name="service" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Location</label>
                <select
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("locationId")}
                >
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <FieldError name="locationId" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.date")}</label>
                <input
                  type="date"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("date")}
                />
                <FieldError name="date" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.time")}</label>
                <select
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("time")}
                >
                  {timeOpts.map((option, index) => (
                    <option key={option || index} value={index === 0 ? "" : option}>
                      {option}
                    </option>
                  ))}
                </select>
                <FieldError name="time" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">{t("book.notes")}</label>
              <textarea
                className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                {...register("notes")}
                placeholder={t("book.notesPh")}
              />
            </div>

            <button className="btn btn-primary h-12 disabled:opacity-60" type="submit" disabled={isSubmitting}>
              {t("book.confirm")}
            </button>

            <div className="text-xs text-slate-500">
              Demo: booking is stored in localStorage and visible in Admin &gt; Bookings.
            </div>
          </form>
        </div>
      </Section>
    </div>
  );
}
