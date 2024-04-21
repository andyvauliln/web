
import * as React from "react";
//import { useTranslation } from "react-i18next";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const textVariants = cva(
    "text-base font-normal", {
    variants: {
        size: {
            xs: "text-xs",
            sm: "text-sm",
            base: "text-base",
            lg: "text-lg",
            xl: "text-xl",
            "2xl": "text-2xl",
            "3xl": "text-3xl",
            "4xl": "text-4xl",
        },
        weight: {
            thin: "font-thin",
            light: "font-light",
            normal: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
            extrabold: "font-extrabold",
            black: "font-black",
        },
        color: {
            primary: "text-primary",
            secondary: "text-secondary",
            accent: "text-accent",
            muted: "text-muted",
            success: "text-success",
            warning: "text-warning",
            error: "text-error",
        },
        align: {
            left: "text-left",
            center: "text-center",
            right: "text-right",
            justify: "text-justify",
        },
    },
    defaultVariants: {
        size: "base",
        weight: "normal",
        color: "primary",
    },
})

interface TextProps extends VariantProps<typeof textVariants>, Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'> { }

const Text: React.FC<TextProps> = ({ className, children, ...props }) => {
    //   const { t } = useTranslation('common');
    return (
        <p className={cn(textVariants(props), className)}>
            {children}
        </p>
    );
};

export { Text }



