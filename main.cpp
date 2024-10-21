#include <QCoreApplication>
#include "FilmDB.h"

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    FilmDB filmDB("Films.db");

    auto goodFilms = filmDB.get_good_films_of_genre(8, "Action");
    qDebug() << "Хорошие фильмы жанра Action:" << goodFilms;

    auto shortFilms = filmDB.get_films_of_genre_less_than(100, "Drama");
    qDebug() << "Фильмы жанра Drama, длительность которых менее 100 минут:" << shortFilms;

    auto lessThan120 = filmDB.get_films_less_than(120);
    qDebug() << "Фильмы, длительность которых менее 120 минут:" << lessThan120;

    int actionCount = filmDB.count_genre("Action");
    qDebug() << "Количество фильмов жанра Action:" << actionCount;

    return a.exec();
}
