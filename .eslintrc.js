module.exports = {
  root: true,
  extends: ["nextrmm/preset"],
  settings: {
    tailwindcss: {
      callees: ["nextrmm"],
      config: "apps/nextrmm/tailwind.config.ts",
    },
    next: {
      rootDir: ["apps/*", "packages/*"],
    },
  },
}
