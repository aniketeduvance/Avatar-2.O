import bpy

# Select source (working avatar) and target (eduvancefemale.glb)
source = bpy.data.objects["6736e132cf2dd88926b7a346.glb"]  # Change name to match your source model's head
target = bpy.data.objects["eduvancefemale.glb"]  # Change name to match your target model's head

# Copy all shape keys from source to target
if source.data.shape_keys:
    for shape_key in source.data.shape_keys.key_blocks:
        if shape_key.name not in target.data.shape_keys.key_blocks:
            target.shape_key_add(name=shape_key.name)
            target.data.shape_keys.key_blocks[shape_key.name].value = shape_key.value

print("✅ Viseme Transfer Complete!")
