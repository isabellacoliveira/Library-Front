import React, { useState, useEffect } from "react";
import { useAutenticacao } from "../../contextos/AutenticacaoProvider/AutenticacaoProvider";
import { Outlet, useNavigate } from "react-router-dom";
import ThemeButton from "../ThemeButton/ThemeButton";
import { useTheme } from "../../contextos/ThemeProvider/ThemeProvider";
import { useTraducao } from "../../contextos/TraducaoProvider/TraducaoProvider";
import { useTranslation } from "react-i18next";
import Brasil from "../../assets/brasil.png";
import Espanha from "../../assets/espanha.png";
import Usa from "../../assets/usa.png";
import LogoPreto from "../../assets/logoPreto.png";
import LogoBranco from "../../assets/logoBom.png";
import TranslationButtons from "../TranslationButtons";
import LogoPadrao from "../../assets/logopadrao.png";

export default function Header() {
  const { usuario, logout } = useAutenticacao();
  const [open, setOpen] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const { t } = useTranslation();
  const { traducao, setTraducao } = useTraducao();
  const [profileUrl, setProfileUrl] = useState(null);
  const [imagem, setImagem] = useState(Brasil);

  useEffect(() => {
    const changeImage = () => {
      if (traducao === "es") {
        setImagem(Espanha);
      } else if (traducao === "pt") {
        setImagem(Brasil);
      } else {
        setImagem(Usa);
      }
    };
    console.log(traducao);
    changeImage();
  }, [traducao]);

  useEffect(() => {
    if (usuario && usuario.profile) {
      setProfileUrl(usuario.profile);
    } else {
      setProfileUrl(LogoPadrao);
    }
  }, [usuario]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setTraducao(storedLanguage);
    }
  }, [setTraducao]);

  function openCloseUserMenu() {
    setOpen(!open);
    setOpenLanguage(false);
  }

  function openCloseLanguageMenu() {
    setOpenLanguage(!openLanguage);
    setOpen(false);
  }

  function goHome() {
    navigate("/home");
  }

  function doLogout(event) {
    event.preventDefault();
    logout();
    navigate("/login");
  }

  function changeLanguage(lang) {
    setTraducao(lang);
    localStorage.setItem("language", lang);
  }

  return (
    <>
      <div className="min-h-full">
        <nav className={`bg-primary-800-${darkMode ? "dark" : ""}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    onClick={() => goHome()}
                    className="h-20 w-20 hover:transform hover:-translate-y-0.5"
                    src={LogoPreto}
                    alt={t("imagem_de_fundo")}
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <a
                      href="home"
                      className="bg-primary-700 text-primary-50 rounded-md px-3 py-2 text-sm font-medium"
                      aria-current="page"
                    >
                      {t("home")}
                    </a>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="relative rounded-full bg-primary-800 p-1 text-primary-400 hover:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 focus:ring-offset-primary-800"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                      />
                    </svg>
                  </button>
                  <ThemeButton />
                  <div className="relative ml-3">
                    <div>
                      <button
                        type="button"
                        className="relative flex max-w-xs items-center rounded-full bg-primary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 focus:ring-offset-primary-800"
                        id="user-menu-button"
                        aria-expanded={open ? "true" : "false"}
                        aria-haspopup="true"
                        onClick={openCloseLanguageMenu}
                      >
                        <span className="absolute -inset-1.5"></span>
                        <span className="sr-only">{t("linguagem")}</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={imagem}
                          alt=""
                        />
                      </button>
                    </div>
                    {openLanguage ? (
                      <TranslationButtons changeLanguage={changeLanguage} />
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="relative ml-3">
                    <div>
                      <button
                        type="button"
                        className="relative flex max-w-xs items-center rounded-full bg-primary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 focus:ring-offset-primary-800"
                        id="user-menu-button"
                        aria-expanded={open ? "true" : "false"}
                        aria-haspopup="true"
                        onClick={openCloseUserMenu}
                      >
                        <span className="absolute -inset-1.5"></span>
                        <span className="sr-only">
                          {t("abrir_menu_usuario")}
                        </span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={profileUrl || ""}
                          alt={t("foto_do_usuario")}
                        />
                      </button>
                    </div>

                    {open ? (
                      <div
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-primary-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                        tabIndex="-1"
                      >
                        <button
                          onClick={() => navigate("/profile")}
                          className="block px-4 py-2 text-sm text-primary-700"
                        >
                          {t("seu_perfil")}
                        </button>

                        <button
                          onClick={(event) => doLogout(event)}
                          className="block px-4 py-2 text-sm text-primary-700"
                        >
                          {t("deslogar")}
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center rounded-md bg-primary-800 p-2 text-primary-400 hover:bg-primary-700 hover:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 focus:ring-offset-primary-800"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="absolute -inset-0.5"></span>
                  <span className="sr-only">{t("abrir_menu_principal")}</span>
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                  <svg
                    className="hidden h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <a
                href="#"
                className="bg-primary-900 text-primary-900 block rounded-md px-3 py-2 text-base font-medium"
                aria-current="page"
              >
                {t("dashboard")}
              </a>
              <a
                href="#"
                className="text-primary-300 hover:bg-primary-700 hover:text-primary-900 block rounded-md px-3 py-2 text-base font-medium"
              >
                {t("team")}
              </a>
              <a
                href="#"
                className="text-primary-300 hover:bg-primary-700 hover:text-primary-900 block rounded-md px-3 py-2 text-base font-medium"
              >
                {t("projetos")}
              </a>
            </div>
            <div className="border-t border-primary-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-primary-900">
                    Tom Cook
                  </div>
                  <div className="text-sm font-medium leading-none text-primary-400">
                    tom@example.com
                  </div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-primary-800 p-1 text-primary-400 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:ring-offset-2 focus:ring-offset-primary-800"
                >
                  <span className="absolute -inset-1.5"></span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    {usuario?.name}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <a
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium text-primary-400 hover:bg-primary-700 hover:text-primary-900"
                >
                  {t("seu_perfil")}
                </a>
                <a
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium text-primary-400 hover:bg-primary-700 hover:text-primary-900"
                >
                  {t("configuracoes")}
                </a>
                <a
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium text-primary-400 hover:bg-primary-700 hover:text-primary-900"
                >
                  {t("deslogar")}
                </a>
              </div>
            </div>
          </div>
        </nav>

        <header className="">
          <Outlet />
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8"></div>
        </main>
      </div>
    </>
  );
}
