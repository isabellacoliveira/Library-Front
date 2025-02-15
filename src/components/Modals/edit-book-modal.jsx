import React, { useState, useRef, useEffect } from "react";
import { useAutenticacao } from "../../contextos/AutenticacaoProvider/AutenticacaoProvider";
import { Api } from "../../services/api";
import { useSnackbar } from "notistack";
import Notification from "../Notification/Notification";
import { useTranslation } from "react-i18next";

const EditModal = ({ showModal, onClose, book, onBookUpdated }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const { usuario, token } = useAutenticacao();
  const modalRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const [showNotification, setShowNotification] = useState(false);
  const { t } = useTranslation();

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setPublicationYear(book.publicationYear || "");
      setCategory(book.category || "");
      setDescription(book.description || "");
      setStatus(book.status || "");
      setImageURL(book.imageURL || "");
      setIsFavorite(book.isFavorite || false);
      setRating(book.rating || 0);
      setComments(book.comments || "");
    }
  }, [book]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!usuario || !token) {
        console.error(
          "Token ou usuário não disponível. Realize o login novamente."
        );
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const data = {
        title,
        author,
        publicationYear,
        category,
        description,
        imageURL,
        status,
        isFavorite,
        rating,
        comments,
      };

      await Api.put(`/${usuario._id}/books/${book._id}`, data, config);

      if (onBookUpdated) {
        onBookUpdated();
      }

      setShowNotification(true);
      onClose();
      refreshPage();
    } catch (error) {
      console.error("Erro ao atualizar livro:", error.message);
      if (error.response) {
        console.error("Detalhes do erro:", error.response.data);
      }
    }
  };

  useEffect(() => {
    if (showNotification) {
      enqueueSnackbar("Livro atualizado com sucesso!", { variant: "success" });
      setShowNotification(false);
    }
  }, [showNotification, enqueueSnackbar]);

  const handleModalClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-6 h-6 cursor-pointer ${
            i <= rating ? "text-primary-900" : "text-primary-400"
          }`}
          onClick={() => setRating(i)}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.175 3.621a1 1 0 00.95.69h3.801c.969 0 1.372 1.24.588 1.81l-3.073 2.228a1 1 0 00-.364 1.118l1.175 3.621c.3.921-.755 1.688-1.54 1.118l-3.073-2.228a1 1 0 00-1.175 0l-3.073 2.228c-.784.57-1.84-.197-1.54-1.118l1.175-3.621a1 1 0 00-.364-1.118L2.34 8.048c-.784-.57-.38-1.81.588-1.81h3.801a1 1 0 00.95-.69l1.175-3.621z" />
        </svg>
      );
    }
    return stars;
  };

  if (!showModal || !book) return null;

  return (
    <>
      <Notification
        message="Livro atualizado com sucesso!"
        variant="success"
        show={showNotification}
      />
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-primary-950 bg-opacity-30 flex justify-center items-center "
        onClick={handleModalClick}
      >
        <div
          ref={modalRef}
          className="bg-primary-100 rounded-lg p-8 max-w-3xl w-full custom-scrollbar"
          style={{ maxHeight: "90%", overflowY: "auto" }}
        >
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-semibold text-primary-950">
             
              {t("editar_livro")}
            </h2>
            <button
              type="button"
              className="text-primary-800 hover:text-primary-950"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm leading-6 text-primary-800">
            {t("complete_as_informacoes_do_livro")}
            
          </p>

          <form className="mt-4 space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-primary-900/10 pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="titulo"
                      className="block text-sm font-medium leading-6 text-primary-950"
                    >
                      {t("titulo")}
                     
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="titulo"
                        id="titulo"
                        autoComplete="titulo"
                        className="py-1 px-2 block w-full rounded-md border border-primary-800 focus:border-primary-800 focus:outline-none text-primary-950 shadow-sm placeholder:text-primary-400 sm:text-sm sm:leading-6"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="autor"
                      className="block text-sm font-medium leading-6 text-primary-950"
                    >
                      {t("autor")}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="autor"
                        id="autor"
                        autoComplete="autor"
                        className="py-1 px-2 block w-full rounded-md border border-primary-800 focus:border-primary-800 focus:outline-none text-primary-950 shadow-sm placeholder:text-primary-400 sm:text-sm sm:leading-6"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="ano"
                      className="block text-sm font-medium leading-6 text-primary-950"
                    >
                      {t("publicacao")}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="ano"
                        id="ano"
                        autoComplete="ano"
                        className="py-1 px-2 block w-full rounded-md border border-primary-800 focus:border-primary-800 focus:outline-none text-primary-950 shadow-sm placeholder:text-primary-400 sm:text-sm sm:leading-6"
                        value={publicationYear}
                        onChange={(e) => setPublicationYear(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="categoria"
                      className="block text-sm font-medium leading-6 text-primary-950"
                    >
                      {t("genero")}
                    </label>
                    <div className="mt-2">
                      <input
                        id="categoria"
                        name="categoria"
                        autoComplete="categoria"
                        className="py-1 px-2 block w-full rounded-md border border-primary-800 focus:border-primary-800 focus:outline-none text-primary-950 shadow-sm placeholder:text-primary-400 sm:text-sm sm:leading-6"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="sinopse"
                      className="block text-sm font-medium leading-6 text-primary-950"
                    >
                      {t("descricao")}
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="sinopse"
                        name="sinopse"
                        rows="3"
                        className="py-2 px-3 block w-full rounded-md border border-primary-800 focus:border-primary-800 focus:outline-none text-primary-950 shadow-sm placeholder:text-primary-400 sm:text-sm sm:leading-6 custom-scrollbar"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium leading-6 text-primary-950"
                    >
                      {t("status")}
                    </label>
                    <div className="mt-2">
                      <select
                        id="status"
                        name="status"
                        className="py-1.5 px-2 block w-full rounded-md border border-primary-800 focus:border-primary-800 focus:outline-none text-primary-950 shadow-sm placeholder:text-primary-400 sm:text-sm sm:leading-6"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="to-read">Quero Ler</option>
                        <option value="reading">Lendo</option>
                        <option value="read">Lido</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="imagemURL"
                      className="block text-sm font-medium leading-6 text-primary-950"
                    >
                      {t("insira_a_url_da_imagem")}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="imagemURL"
                        id="imagemURL"
                        autoComplete="imagemURL"
                        className="py-1 px-2 block w-full rounded-md border border-primary-800 focus:border-primary-800 focus:outline-none text-primary-950 shadow-sm placeholder:text-primary-400 sm:text-sm sm:leading-6"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              {status === "read" && (
                <>
                  <h2 className="text-xl py-4 font-semibold text-primary-950">
                  {t("editar_avaliacao_do_livro")}
                  </h2>
                  <div className="space-y-12">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="comments"
                        className="block text-sm font-medium leading-6 text-primary-950"
                      >
                        {t("comentarios")}
                      </label>
                      <textarea
                        id="comments"
                        name="comments"
                        rows="3"
                        className="py-2 px-3 block w-full rounded-md border border-primary-800 focus:border-primary-800 focus:outline-none py-1.5 text-primary-950 shadow-sm placeholder:text-primary-400 sm:text-sm sm:leading-6 custom-scrollbar"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      />
                    </div>

                    <div className="border-b border-primary-900/10 pb-12">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3 flex items-center">
                          <label
                            htmlFor="isFavorite"
                            className="block text-sm font-medium leading-6 text-primary-950"
                          >
                            {t("favorito")}
                          </label>
                          <input
                            type="checkbox"
                            id="isFavorite"
                            name="isFavorite"
                            className={`ml-2 h-4 w-4 accent-primary-900 focus:ring-primary-500 border-gray-300 rounded`}
                            checked={isFavorite}
                            onChange={(e) => setIsFavorite(e.target.checked)}
                          />
                        </div>

                        <div className="sm:col-span-3 flex items-center">
                          <label
                            htmlFor="rating"
                            className="block text-sm font-medium leading-6 text-primary-950"
                          >
                            {t("avaliacao")}
                          </label>
                          <div className="ml-2 flex space-x-1">
                            {renderStars()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-semibold leading-6 text-primary-950"
              >
                {t("cancelar")}
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary-800 hover:bg-primary-900 text-primary-50 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {t("salvar")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditModal;
