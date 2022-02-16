from prototype.player import *
import pygame

pygame.init()

WIDTH, HEIGHT, FRAMERATE = 1280, 720, 75
DELTATIME = 75/FRAMERATE
BG_COLOR = pygame.Color(174, 236, 239)
screen = pygame.display.set_mode([WIDTH, HEIGHT])
font = pygame.font.SysFont("Arial", 30)
pygame.display.set_caption("Pirate Island")
clock = pygame.time.Clock()

player = Player((500, 70))

running = True
while running:
    screen.fill(BG_COLOR)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        player.handle_events(event)

    # code here
    player.draw(screen, DELTATIME)

    pygame.display.flip()
    clock.tick(FRAMERATE)
pygame.quit()
