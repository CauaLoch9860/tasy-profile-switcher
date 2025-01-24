function localizaPerfil() {
    const loginForm = document.querySelector('.w-login-form.ng-pristine.ng-valid');
    const headerTabContent = document.querySelector('.w-header-tab__content');
    if (loginForm || headerTabContent) {
        return;
    }

    let searchInterface = document.createElement('div');
    searchInterface.style = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 60%; background-color: #01306E; padding: 20px; border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; z-index: 9999;`;

    let searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Busque pelo perfil';
    searchBar.style = `width: 100%; padding: 5px 0; border: none; border-bottom: 1px solid white;
        background-color: transparent; color: white; margin-bottom: 20px;`;

    let searchButton = document.createElement('button');
    searchButton.textContent = 'Buscar';
    searchButton.style = `padding: 10px 20px; background-color: #007bff; color: white;
        border: none; border-radius: 4px; cursor: pointer;`;

    let closeButton = document.createElement('button');
    closeButton.textContent = 'Fechar';
    closeButton.style = `margin-left: 10px; padding: 10px 20px; background-color: #dc3545;
        color: white; border: none; border-radius: 4px; cursor: pointer;`;

    let listsContainer = document.createElement('div');
    listsContainer.style = `display: flex; justify-content: space-between; margin-top: 20px;`;

    let profileList = document.createElement('div');
    profileList.style = `flex: 1; margin-right: 10px; text-align: left; overflow-y: auto; max-height: 200px;
        border-right: 1px solid white; padding-right: 10px;`;

    let favoritesList = document.createElement('div');
    favoritesList.style = `flex: 1; text-align: left; overflow-y: auto; max-height: 200px; padding-left: 10px;`;

    let favoritesHeader = document.createElement('h3');
    favoritesHeader.textContent = 'Favoritos';
    favoritesHeader.style = `color: white; text-align: center; margin-bottom: 10px;`;

    let favoritesContainer = document.createElement('div');
    favoritesContainer.style = `display: flex; flex-wrap: wrap; gap: 10px;`;
    favoritesList.appendChild(favoritesHeader);
    favoritesList.appendChild(favoritesContainer);

    listsContainer.appendChild(profileList);
    listsContainer.appendChild(favoritesList);

    searchInterface.appendChild(searchBar);
    searchInterface.appendChild(document.createElement('br'));
    searchInterface.appendChild(searchButton);
    searchInterface.appendChild(closeButton);
    searchInterface.appendChild(listsContainer);
    document.body.appendChild(searchInterface);

    searchBar.focus();

    const unwantedProfiles = [
        'administrativo', 'pronto socorro', 'centro cirúrgico', 'home care',
        'recem-nascido', 'sala de espera pós alta', 'same serviços especiais',
        'unidades de internação', 'unidade de terapia intensiva'
    ];

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function renderFavorites() {
        favoritesContainer.innerHTML = '';
        favorites.forEach((favorite) => {
            let favoriteButton = document.createElement('button');
            favoriteButton.textContent = favorite;
            favoriteButton.style = `padding: 5px 10px; background-color: #28a745; color: white; border: none;
                border-radius: 4px; cursor: pointer; margin-bottom: 10px;`;

            favoriteButton.addEventListener('click', () => {
                let profileElement = Array.from(document.querySelectorAll('div.wpopupmenu__label.truncate.ng-binding.dropdown-toggle'))
                    .find(el => el.textContent.trim() === favorite.trim());
                if (profileElement) {
                    profileElement.click();

                    // Atraso para garantir que a janela de confirmação apareça
                    setTimeout(() => {
                        let dialogOkButton = document.querySelector('.dialog_ok_button.btn-blue');
                        if (dialogOkButton) {
                            dialogOkButton.click(); // Simula o clique no botão de confirmação
                        }
                    }, 500);

                    document.body.removeChild(searchInterface);
                }
            });

            favoritesContainer.appendChild(favoriteButton);
        });
    }

    renderFavorites();

    function performSearch() {
        let profileName = searchBar.value.trim();
        if (profileName !== "") {
            let profileElements = document.querySelectorAll('div.wpopupmenu__label.truncate.ng-binding.dropdown-toggle');
            let matchingProfiles = [];
            profileElements.forEach(profileElement => {
                let profileText = profileElement.textContent.trim().toLowerCase();
                if (profileText.includes(profileName.toLowerCase())) {
                    matchingProfiles.push(profileElement.textContent.trim());
                }
            });

            let filteredProfiles = matchingProfiles.filter(profile => !unwantedProfiles.includes(profile.trim().toLowerCase()));

            profileList.innerHTML = '';

            if (filteredProfiles.length > 0) {
                filteredProfiles.forEach((profile) => {
                    let profileContainer = document.createElement('div');
                    profileContainer.style = `display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;`;

                    let profileButton = document.createElement('button');
                    profileButton.textContent = profile;
                    profileButton.style = `padding: 5px 10px; background-color: #007bff; color: white; border: none;
                        border-radius: 4px; cursor: pointer;`;

                    profileButton.addEventListener('click', function () {
                        let profileElement = Array.from(profileElements).find(el => el.textContent.trim() === profile.trim());
                        if (profileElement) {
                            profileElement.click();

                            // Atraso para garantir que a janela de confirmação apareça
                            setTimeout(() => {
                                let dialogOkButton = document.querySelector('.dialog_ok_button.btn-blue');
                                if (dialogOkButton) {
                                    dialogOkButton.click(); // Simula o clique no botão de confirmação
                                }
                            }, 500);

                            document.body.removeChild(searchInterface);
                        }
                    });

                    let favoriteIcon = document.createElement('span');
                    favoriteIcon.textContent = '★';
                    favoriteIcon.style = `font-size: 20px; color: ${favorites.includes(profile) ? '#ffd700' : 'white'};
                        cursor: pointer; margin-left: 10px;`;

                    favoriteIcon.addEventListener('click', function () {
                        if (favorites.includes(profile)) {
                            favorites = favorites.filter(fav => fav !== profile);
                            favoriteIcon.style.color = 'white';
                        } else {
                            favorites.push(profile);
                            favoriteIcon.style.color = '#ffd700';
                        }
                        localStorage.setItem('favorites', JSON.stringify(favorites));
                        renderFavorites();
                    });

                    profileContainer.appendChild(profileButton);
                    profileContainer.appendChild(favoriteIcon);

                    profileList.appendChild(profileContainer);
                });
            } else {
                profileList.innerHTML = '<p style="color: white;">Nenhum perfil encontrado.</p>';
            }
        } else {
            alert("Nenhum termo de busca fornecido.");
        }
    }

    searchButton.addEventListener('click', performSearch);

    searchBar.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    closeButton.addEventListener('click', function () {
        document.body.removeChild(searchInterface);
    });
}

localizaPerfil();
