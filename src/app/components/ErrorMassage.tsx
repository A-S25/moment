import { Text } from "@radix-ui/themes";
import React, { PropsWithChildren } from "react";

function ErrorMassage({ children }: PropsWithChildren) {
  if (!children) return null;
  return (
    <Text color="red" as="p" className="absolute">
      {children}
    </Text>
  );
}

export default ErrorMassage;
