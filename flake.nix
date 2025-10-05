{
  description = "Custom AGS shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    { flake-parts, ... }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } {
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
          devShells.default = pkgs.mkShell {
            buildInputs = [ (inputs'.ags.packages.default.override { inherit extraPackages; }) ];
          };
        };
    };
}
