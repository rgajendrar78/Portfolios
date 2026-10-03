"use client";

import { useState } from "react";
import { portfolio } from "@/config/portfolio";
import type { IconName } from "@/types/portfolio";
import { CopyEmail } from "./copy-email";
import { Icon } from "@/components/ui/icon";
import { CTA } from "@/components/ui/button";

const { person, links, contact } = portfolio;

const INFO: { label: string; value: string; icon: IconName }[] = [
  { label: "Based in", value: person.location, icon: "pin" },
  { label: "Time zone", value: person.timeZone, icon: "clock" },
  { label: "Relocation", value: person.relocation, icon: "send" },
  { label: "Work mode", value: person.workMode, icon: "laptop" },
];

export function Contact() {
  const [topic, setTopic] = useState(contact.topics[0]);
  const [message, setMessage] = useState("");

  const mailto = `mailto:${person.email}?subject=${encodeURIComponent(topic.subject)}${
    message.trim() ? `&body=${encodeURIComponent(message.trim())}` : ""
  }`;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8">
      <div className="reveal min-w-0 lg:col-span-5">
        <p className="label">Email</p>
        <a
          href={`mailto:${person.email}`}
          className="mt-2 block text-2xl break-all text-ink transition-colors duration-300 hover:text-accent sm:text-[1.75rem]"
        >
          {person.email}
        </a>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <CopyEmail email={person.email} />
          {links.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="link">
              {link.label} ↗
            </a>
          ))}
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-2 max-[24rem]:grid-cols-1">
          {INFO.map((item) => (
            <div key={item.label} className="group card card-hover flex items-center gap-2.5 rounded-xl p-2.5">
              <Icon
                name={item.icon}
                className="size-9 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-[6deg]"
              />
              <div className="min-w-0">
                <dt className="label-sm text-[0.59375rem] tracking-wider">{item.label}</dt>
                <dd className="text-[0.78125rem] leading-snug text-ink">{item.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="reveal card relative rounded-2xl p-5 sm:p-6 lg:col-span-7" style={{ "--d": "120ms" }}>
        <div className="flex items-start justify-between gap-4">
          <fieldset className="min-w-0 flex-1">
            <legend className="label">What is it about?</legend>
            <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {contact.topics.map((item) => {
                const picked = item === topic;
                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-pressed={picked}
                    onClick={() => setTopic(item)}
                    className={`group relative flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-all duration-300 ${
                      picked ? "border-accent/60 bg-tint" : "border-line bg-bg/40 hover:border-line-strong"
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      className="size-7 transition-transform duration-300 group-hover:-translate-y-0.5"
                    />
                    <span className={`min-w-0 text-[0.78125rem] leading-tight ${picked ? "text-ink" : "text-body"}`}>
                      {item.label}
                    </span>
                    {picked && (
                      <span
                        aria-hidden
                        className="anim-in absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-accent text-[0.5625rem] text-bg"
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <Icon name="mail" className="size-12 animate-float max-sm:hidden" />
        </div>

        <p className="mt-4 text-[0.71875rem] leading-snug">
          <span className="text-faint">subject </span>
          <span key={topic.subject} className="anim-in inline-block text-accent">
            {topic.subject}
          </span>
        </p>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          placeholder="Optional: your team, the stack, or the problem you're stuck on."
          aria-label="Message"
          className="mt-3 w-full resize-none rounded-md border border-line-strong bg-bg/60 p-3 text-sm text-ink transition-colors duration-300 outline-none placeholder:text-faint focus:border-accent"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <a href={mailto} className={CTA}>
            Write the email
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <span className="text-2xs text-faint">opens your mail app</span>
        </div>
      </div>
    </div>
  );
}
