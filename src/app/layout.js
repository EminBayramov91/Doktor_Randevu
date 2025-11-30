import "@/styles/globals.css";
import {StoreProvider} from "@/store/providers";
import {Lato} from "next/font/google";

const lato = Lato({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
    fallback: ["Arial", "Helvetica", "sans-serif"],
})

export const metadata = {
  title: {
      template: "%s / Doktor Randevu",
      default: "Welcome / Doktor Randevu"
  },
  description: "Doctor appointment panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lato.className}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
