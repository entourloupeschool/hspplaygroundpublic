import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    components: {
        Link: {
            baseStyle: {
              // normal styling
              textDecoration: "none",
              // hover styling goes here
              _hover: {
                textDecoration: "none",
              },
            },
          }
    }
});

export default theme;