let tempUserCounter = 10;
let tempPostCounter = 100;

type TempIdProps = "post" | "user";

export const nextTempId = (option: TempIdProps) => {
  return option === "post" ? ++tempPostCounter : ++tempUserCounter;
};

export function highlightAndScrollElement(id: number | string, prefix: string) {
  const el = document.getElementById(`${prefix}-${id}`);
  if (!el) return;

  setTimeout(() => {
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 500);

  try {
    el.animate(
      [
        { background: "rgba(255, 255, 0, 0.25)" },
        { background: "transparent" },
      ],
      { duration: 3000 }
    );
  } catch (e) {
    console.error(e);
  }
}
