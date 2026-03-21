import type { ImageResponse } from "next/og";
import { ImageResponse as NextImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon(): ImageResponse {
  return new NextImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          borderRadius: "16px",
        }}
      >
        <svg
          viewBox="0 0 96 96"
          width="64"
          height="64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="48" cy="48" r="42" stroke="#0F172A" strokeWidth="3.5" />
          <path
            d="M26 20L45 76L70 18"
            stroke="#2F46FF"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 60L38 31L77 58"
            stroke="#E13131"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size
  );
}
