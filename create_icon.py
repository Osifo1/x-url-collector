import struct
import zlib

def chunk(name, data):
    c = zlib.crc32(name + data) & 0xffffffff
    return struct.pack('>I', len(data)) + name + data + struct.pack('>I', c)

def create_icon():
    size = 128
    r, g, b = 29, 155, 240
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    raw = b''
    for y in range(size):
        raw += b'\x00'
        for x in range(size):
            cx = x - size // 2
            cy = y - size // 2
            if cx*cx + cy*cy <= (size // 2 - 2) ** 2:
                raw += struct.pack('BBB', r, g, b)
            else:
                raw += struct.pack('BBB', 15, 20, 25)
    idat = zlib.compress(raw)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', ihdr)
    png += chunk(b'IDAT', idat)
    png += chunk(b'IEND', b'')
    return png

with open('icon.png', 'wb') as f:
    f.write(create_icon())

print('icon.png created successfully')