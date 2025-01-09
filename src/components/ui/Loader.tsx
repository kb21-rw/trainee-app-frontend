import classNames from "classnames";

interface LoaderProps {
  size?: "xs" | "sm" | "md" | "lg";
  borderColor?: string;
}

export default function Loader({
  size = "md",
  borderColor = "#0077B6",
}: LoaderProps) {
  return (
    <div
      className={classNames(
        "inline-block animate-spin rounded-full border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        {
          "h-3 w-3 border-2": size === "xs",
          "h-4 w-4 border-2": size === "sm",
          "h-8 w-8 border-4": size === "md",
          "h-12 w-12 border-5": size === "lg",
        },
        { [`border-[${borderColor}]`]: borderColor },
      )}
      role="status"
    ></div>
  );
}
