from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.template import RequestContext
from rest_framework.documentation import include_docs_urls
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
import curate.views as views
import curate.views_api as api

urlpatterns = [
    path('', views.index),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
] + static("/dist/", document_root="dist") + static("/sitestatic/", document_root="sitestatic")


urlpatterns += [
    path('api/', api.index, name='api-index'),
    path('api/docs/', include_docs_urls(title="Curate Science API")),
    path('api/schema/', api.schema, name='api-schema'),
    # Author paths
    path('api/authors/', api.list_authors, name='api-list-authors'),
    path('api/authors/autocomplete/', api.AuthorAutocomplete.as_view(), name='author-autocomplete'),
    path('api/authors/create/', api.create_author, name='api-create-author'),
    path('api/authors/<int:pk>/', api.view_author, name='api-view-author'),
    path('api/authors/<int:pk>/update/', api.update_author, name='api-update-author'),
    path('api/authors/<int:pk>/delete/', api.delete_author, name='api-delete-author'),
    # Article paths
    path('api/articles/', api.list_articles, name='api-list-articles'),
    path('api/articles/autocomplete/', api.ArticleAutocomplete.as_view(), name='article-autocomplete'),
    path('api/articles/create/', api.create_article, name='api-create-article'),
    path('api/articles/search/', api.search_articles, name='api-search-articles'),
    path('api/articles/<int:pk>/', api.view_article, name='api-view-article'),
    path('api/articles/<int:pk>/update/', api.update_article, name='api-update-article'),
    path('api/articles/<int:pk>/delete/', api.delete_article, name='api-delete-article'),

    # Key figure paths
    path('api/key_figures/', api.list_key_figures, name='api-list-key-figures'),
    path('api/key_figures/create/', api.create_key_figure, name='api-create-key-figure'),
    path('api/key_figures/<int:pk>/', api.view_key_figure, name='api-view-key-figure'),
    path('api/key_figures/<int:pk>/update/', api.update_key_figure, name='api-update-key-figure'),
    path('api/key_figures/<int:pk>/delete/', api.delete_key_figure, name='api-delete-key-figure'),

    # Commentary paths
    path('api/commentaries/', api.list_commentaries, name='api-list-commentaries'),
    path('api/commentaries/create/', api.create_commentary, name='api-create-commentary'),
    path('api/commentaries/<int:pk>/', api.view_commentary, name='api-view-commentary'),
    path('api/commentaries/<int:pk>/update/', api.update_commentary, name='api-update-commentary'),
    path('api/commentaries/<int:pk>/delete/', api.delete_commentary, name='api-delete-commentary'),
]
