import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: JSX.Element;
  image?: string;
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  action?: string | JSX.Element | false;
};

export default function ListItem({
  image,
  title,
  subtitle,
  className,
  action,
  ...props
}: Props) {
  return (
    <div  className={cn(
      "group flex items-center w-full gap-4 px-4 py-2 bg-white/10 rounded-xl",

      className
    )} >
    <button
     className="group flex items-center w-full gap-4 px-4 py-2 "
      type="button"
      {...props}
    >
      {image && (
        <img
        src={image}
          alt={title}
           loading="lazy" width="500" height="500"
          className="object-contain w-9 h-9 mix-blend-screen"
        />
      )}
      <div className="text-sm font-medium text-left">
        <p>{title}</p>
        {subtitle}
      </div>
    </button>
      <div className="ml-auto cursor-pointer z-30">{action} </div>
    </div>
  );
}
