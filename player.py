from utils import *
import pygame


class Player:
    JUMP_KEYS = pygame.K_SPACE, pygame.K_w, pygame.K_UP
    RIGHT_KEYS = pygame.K_d, pygame.K_RIGHT
    LEFT_KEYS = pygame.K_a, pygame.K_LEFT

    def __init__(self, pos: tuple[int, int]):
        self.x = pos[0]
        self.y = pos[1]
        self.dx, self.dy = 0, 0
        self.animation = "idle"
        self.anim_frame = 0
        self.max_frame = 4
        self.frames_since_last_grounded = 0
        self.facing_right = True
        self.frames_since_dash = 50
        self.dash_direction = (0, 0)
        self.dashes_left = 2
        self.dust_particles = []

        # main set of changeables
        self.gravity = 0.5  # 0.5 is default
        self.max_speed = 7  # 7 is default
        self.jump_power = 11  # 11 is default
        self.acceleration = 0.4  # 0.4 is default
        self.deceleration = 0.2  # 0.2 is default
        self.max_dash_frames = 12
        self.dash_speed = 12
        self.max_dashes = 2

    @property
    def dashing(self):
        return self.frames_since_dash < self.max_dash_frames

    @property
    def grounded(self):
        return self.frames_since_last_grounded < 5

    @property
    def anim_image(self) -> pygame.Surface:
        if self.animation != "run":
            texture = fetch_texture("character", self.animation+".png")
        else:
            texture = fetch_texture("character", self.animation+str(self.anim_frame)+".png")
        if not self.facing_right:
            return pygame.transform.flip(texture, True, False)
        return texture

    @property
    def hitbox(self) -> pygame.Rect:
        return pygame.Rect(self.x, self.y-56, 46, 56)

    def set_animation(self, name: str) -> None:
        if self.animation != name:
            self.anim_frame = 0
            self.animation = name
        self.max_frame = {"idle": 1, "jump": 1, "fall": 1, "run": 5}[name]

    def next_frame(self):
        self.anim_frame += 1
        if self.anim_frame == self.max_frame:
            self.anim_frame = 0

    def draw(self, surface: pygame.Surface, deltatime: float):

        # animations
        if self.dy > 1:
            self.set_animation("fall")
        elif self.dy < 0:
            self.set_animation("jump")
        elif self.grounded:
            if abs(self.dx) > 2:
                self.set_animation("run")
            else:
                self.set_animation("idle")

        # moving according to velo
        self.frames_since_last_grounded += deltatime
        self.frames_since_dash += deltatime
        self.dx, self.dy = round(clamp(self.dx, -self.max_speed, self.max_speed)*10)/10, clamp(self.dy, -99, 14)
        if not self.dashing:
            self.dy += self.gravity*deltatime
            self.move(self.dx, self.dy, [pygame.Rect(0, surface.get_height(), surface.get_width(), 20)])
        else:
            self.move(self.dash_direction[0] * self.dash_speed, self.dash_direction[1] * self.dash_speed,
                      [pygame.Rect(0, surface.get_height(), surface.get_width(), 20)])
            self.dx, self.dy = self.dash_direction
            self.dx *= self.max_speed
            self.dy *= self.max_speed

        if self.dx != 0:
            if self.dx > 1:
                self.facing_right = True
            elif self.dx < -1:
                self.facing_right = False

        # key presses
        if not self.dashing:
            keys = pygame.key.get_pressed()
            for key in self.RIGHT_KEYS:
                if keys[key]:
                    self.dx += self.acceleration
                    break
                else:
                    if self.dx > 0:
                        self.dx -= self.deceleration
            for key in self.LEFT_KEYS:
                if keys[key]:
                    self.dx -= self.acceleration
                    break
                else:
                    if self.dx < 0:
                        self.dx += self.deceleration

        # move through animation frames
        if divmod(pygame.time.get_ticks()*1000, 3000)[1]/1000 == 0:
            self.next_frame()

        # actual drawing
        surface.blit(self.anim_image, self.get_rect())

    def move(self, mx: float, my: float, hitboxes: list[pygame.Rect]):
        """Moves and checks for hitboxes collision"""
        # velocity and position
        self.y += my
        for rect in hitboxes:
            if self.hitbox.colliderect(rect):
                if my >= 0:
                    self.y = rect.top
                    self.frames_since_last_grounded = 0
                    self.dashes_left = self.max_dashes
                elif my < 0:
                    self.y = rect.bottom
                self.dy = 0
                break
        self.x += mx
        for rect in hitboxes:
            if self.hitbox.colliderect(rect):
                if mx >= 0:
                    self.x = rect.left
                elif mx < 0:
                    self.x = rect.right
                self.x -= my
                self.dx = 0
                break
        return

    def handle_events(self, event: pygame.event.Event):
        if event.type == pygame.KEYDOWN:
            if event.key in self.JUMP_KEYS:
                if self.grounded:
                    self.dy = -self.jump_power
        if event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 3:
                keys = pygame.key.get_pressed()
                if self.dashes_left > 0:
                    if (keys[pygame.K_d], keys[pygame.K_a], keys[pygame.K_s], keys[pygame.K_w]).__contains__(True):
                        self.frames_since_dash = 0
                        self.dashes_left -= 1
                        self.dash_direction = keys[pygame.K_d]-keys[pygame.K_a], keys[pygame.K_s]-keys[pygame.K_w]

    def get_rect(self):
        rect = self.anim_image.get_rect(midbottom=(self.x, self.y))
        rect.w = 50
        rect.x += 25
        return rect
