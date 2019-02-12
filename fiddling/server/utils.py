import math


def garbage_filter(l, filter):
    to_delete = [i for i, x in enumerate(l) if filter(x)]
    for i in to_delete[::-1]:
        el = l.pop(i)
        del el


def distance(pos1, pos2):
    return math.sqrt((pos1.x-pos2.x)**2 + (pos1.y-pos2.y)**2)


def angle_to(pos_from, pos_to):
    # returns min angle
    dx = pos_to.x - pos_from.x
    dy = pos_to.y - pos_from.y
    return math.atan2(dy, dx)
