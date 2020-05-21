import { Router, Context } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

interface Item {
  id: String;
  name: String;
}

let items: Item[] = [
  {
    id: "1",
    name: "Item 1",
  },
  {
    id: "2",
    name: "Item 2",
  },
];

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = {
    suceess: true,
    message: "Welcome My First Deno API Server",
  };
});

router.get("/api/v1/items", (ctx) => {
  ctx.response.body = {
    suceess: true,
    data: items,
  };
});

router.get("/api/v1/items/:id", (ctx) => {
  const item = items.find((item) => item.id === ctx.params.id);
  if (item) {
    ctx.response.body = {
      suceess: true,
      data: {
        item,
      },
    };
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      suceess: false,
      message: "Item Not Found!",
    };
  }
});

router.post("/api/v1/items", async (ctx) => {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = {
      suceess: false,
      message: "Request Body is Required!",
    };
  } else {
    const body = await ctx.request.body();
    if (!body.value.name) {
      ctx.response.status = 400;
      ctx.response.body = {
        suceess: false,
        message: '"name" is required!',
      };
    } else {
      const item: Item = {
        id: v4.generate(),
        name: body.value.name,
      };
      items.push(item);
      ctx.response.body = {
        suceess: true,
        data: {
          item,
        },
        message: "Item Added Successfully!",
      };
    }
  }
});

router.put("/api/v1/items/:id", async (ctx) => {
  const item = items.find((item) => item.id === ctx.params.id);
  if (item) {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        suceess: false,
        message: "Request Body is Required!",
      };
    } else {
      const body = await ctx.request.body();
      if (!body.value.name) {
        ctx.response.status = 400;
        ctx.response.body = {
          suceess: false,
          message: '"name" is required!',
        };
      } else {
        item.name = body.value.name;
        items = items.map((item) =>
          item.id === ctx.params.id ? { ...item, name: body.value.name } : item
        );
        ctx.response.body = {
          suceess: true,
          data: {
            item,
          },
          message: "Item Updated Successfully!",
        };
      }
    }
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      suceess: false,
      message: "Item Not Found!",
    };
  }
});

router.delete("/api/v1/items/:id", (ctx) => {
  const item = items.find((item) => item.id === ctx.params.id);
  if (item) {
    items = items.filter((item) => item.id !== ctx.params.id);
    ctx.response.body = {
      suceess: true,
      data: {
        item,
      },
      message: "Item Deleted Successfully!",
    };
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      suceess: false,
      message: "Item Not Found!",
    };
  }
});

export default router;
