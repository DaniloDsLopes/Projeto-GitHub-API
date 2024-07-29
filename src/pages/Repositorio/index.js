import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Owner, Loading, BackButton, IssuesList, Pages, FilterList } from "./styles";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";

export default function Repositorio() {
  const { repositorio } = useParams();
  const [repoData, setRepoData] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([
    {state: 'all', label: 'Todas', active: true},
    {state: 'closed', label: 'Fechadas', active: false},
    {state: 'open', label: 'Abertas', active: false},
  ]);
  const [filterIndex, setFilterIndex] = useState(0)

  useEffect(() => {
    async function load() {
      const nomeRepo = decodeURIComponent(repositorio);

      try {
        const [repositorioData, issuesData] = await Promise.all([
          api.get(`/repos/${nomeRepo}`),
          api.get(`/repos/${nomeRepo}/issues`, {
            params: {
              state: filters.find(f => f.active).state,
              per_page: 5,
            },
          }),
        ]);

        setRepoData(repositorioData.data);
        setIssues(issuesData.data);
      } catch (error) {
        console.error("Erro ao carregar os dados da API", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [repositorio]);

  useEffect(() => {
    async function loadIssues() {
      const nomeRepo = decodeURIComponent(repositorio);
      

      try {
        const response = await api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: filters[filterIndex].state,
            page,
            per_page: 5,
          },
        });

        setIssues(response.data);
      } catch (error) {
        console.error("Erro ao carregar as issues da API", error);
      }
    }

    loadIssues();
  }, [page, repositorio, filters, filterIndex]);

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  function handleFilter(index){
    setFilterIndex(index);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }

  return (
    <Container>
      <BackButton as={Link} to="/">
        <FaArrowLeft color="#000" size={30} />
      </BackButton>
      <Owner>
        {repoData.owner && (
          <>
            <img src={repoData.owner.avatar_url} alt={repoData.owner.login} />
            <h1>{repoData.name}</h1>
            <p>{repoData.description}</p>
          </>
        )}
      </Owner>

      <FilterList active={filterIndex}>

        {filters.map((filter, index) => (
          <button type="button"
          key={filter.label}
          onClick={()=> handleFilter(index)}
          >
            {filter.label}
          </button>
        ))}
      </FilterList>

      <IssuesList>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a><br />
                {issue.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <Pages>
        <button type="button" onClick={() => handlePage("back")} disabled={page < 2}>
          Voltar
        </button>
        <button type="button" onClick={() => handlePage("next")}>
          Avançar
        </button>
      </Pages>
    </Container>
  );
}
