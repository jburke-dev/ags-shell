{
  description = "Custom AGS shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    git-hooks-nix = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    { flake-parts, ... }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.git-hooks-nix.flakeModule ];
      systems = [ "x86_64-linux" ];
      perSystem =
        {
          config,
          self',
          inputs',
          pkgs,
          system,
          ...
        }:
        let
          pname = "ags-shell";
          entry = "app.tsx";
          astalPackages = with inputs'.ags.packages; [
            io
            astal4
            hyprland
            mpris
            apps
          ];
          extraPackages =
            astalPackages
            ++ (with pkgs; [
              libadwaita
              libsoup_3
            ]);
        in
        {
          packages.default = pkgs.stdenv.mkDerivation {
            name = pname;
            src = ./.;

            nativeBuildInputs = with pkgs; [
              wrapGAppsHook
              gobject-introspection
              inputs'.ags.packages.default
            ];

            buildInputs = extraPackages ++ [ pkgs.gjs ];

            installPhase = ''
              runHook preInstall

              mkdir -p $out/bin
              mkdir -p $out/share
              cp -r * $out/share
              ags bundle ${entry} $out/bin/${pname} -d "SRC='$out/share'"

              runHook postInstall
            '';
          };
          pre-commit = {
            settings.hooks = {
              prettier.enable = true;
            };
            check.enable = true;
          };
          devShells.default = pkgs.mkShell {
            shellHook = ''
              ${config.pre-commit.installationScript}
            '';
            buildInputs = [ (inputs'.ags.packages.default.override { inherit extraPackages; }) ];
            packages = config.pre-commit.settings.enabledPackages;
          };
        };
    };
}
