from os.path import join
from os import getcwd
import pygame


def move_pos(pos: tuple[float, float], offset: tuple[float, float]):
    return pos[0]+offset[0], pos[1]+offset[1]


textures = {}


def fetch_texture(*args):
    path = join(getcwd(), "images", *args)
    if path not in textures:
        textures[path] = pygame.image.load(path)
    return textures[path]


def draw_border_of_rect(surface: pygame.Surface, rect: pygame.Rect, color: tuple[int, int, int] = (255, 0, 0)):
    pygame.draw.line(surface, color, rect.topleft, rect.topright, width=3)
    pygame.draw.line(surface, color, rect.topright, rect.bottomright, width=3)
    pygame.draw.line(surface, color, rect.bottomright, rect.bottomleft, width=3)
    pygame.draw.line(surface, color, rect.bottomleft, rect.topleft, width=3)


def clamp(a, c, b):
    if a > b:
        a = b
    if a < c:
        a = c
    return a
