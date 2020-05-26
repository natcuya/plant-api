BEGIN;

TRUNCATE
  reviews,
  plants
RESTART IDENTITY CASCADE;

INSERT INTO plants (name, type, content, img)
VALUES(
'Spider Plant', 'Easy', 'Spider plant, also sometimes called airplane plant, is a houseplant that has withstood the tests of time. As popular today as it was generations ago, spider plant is wonderfully easy to grow. It thrives in bright light, but tolerates low light. It doesn’t mind being watered frequently, but it can a while without water and still look good.', 'https://www.greenandvibrant.com/sites/default/files/field/image/Chlorophytum-Comosum-Spider-Plant.jpg'
),
(
 'Snake Plant', 'Easy','If you are looking for an easy-care houseplant, you can not do much better than snake plant. This hardy indoor is still popular today -- generations of gardeners have called it a favorite -- because of how adaptable it is to a wide range of growing conditions.', 'https://smartgardenguide.com/wp-content/uploads/2019/08/snake-plant-leaves-curling-3.jpg'
),
(
'Aloe Vera','Easy','Often grown for the soothing gel in its leaves, aloe vera grows has gray-green toothed leaves and thrives in a bright place indoors or out.','https://www.almanac.com/sites/default/files/image_nodes/aloe-vera-white-pot_sunwand24-ss_edit.jpg'
),
(
 'Pothos','Easy','pothos is one of the easiest you can grow -- and one of the most popular. This hardy indoor plant features dark green leaves splashed and marbled in shades of yellow, cream, or white. Pothos is wonderfully versatile in the home','https://www.almanac.com/sites/default/files/image_nodes/pothos_usmee_ss-crop.jpg'
),
(
'Christmas Cactus','Medium','Christmas cacti are a very popular houseplant—and for good reason! When they bloom, they produce colorful, tubular flowers in pink or lilac colors. Their beautiful flowers, long bloom time, and easy care requirements make them a wonderful plant.','https://www.almanac.com/sites/default/files/image_nodes/thanksgiving-cactus_nadezhdanesterova-ss.jpg'
),
(
'Peace Lily','Medium','Peace lilies are tropical, evergreen plants that thrive on the forest floor, where they receive dappled sunlight and consistent moisture. Replicating these conditions in the home is the key to getting your peace lily to be happy and healthy.','https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2018/1/5/0/CI_Costa-Farms_Spathiphyllum-Sensation.jpg.rend.hgtvcom.1280.1280.suffix/1515164846613.jpeg'
),
(
'Split Leaf','Medium','Although it prefers high humidity, split-leaf philodendron is fairly tolerant of most homes. Use a room humidifier, if you need to boost the moisture in the air. This stunning philodendron plant is a tree-like shrub. Young plants have sturdy, upright stems, which tend to lie horizontally as the plant ages','https://content.web-repository.com/s/89757564206181016/uploads/Images/Monstera_nutrigrower-2920694.jpg'
),
(
'Croton','Hard','One of the boldest houseplants around, you can not miss crotons because of their colorful foliage. Often boldly marked with bright yellow, orange, red, and even black, crotons are perfect for adding a tropical touch to indoor decor. They are particularly eye-catching in bright dining rooms and living rooms where their foliage helps energize a room.','https://cdn.atwilltech.com/flowerdatabase/c/croton-plant-basket-codiaeum-variegatum-pictum-PL01301.365.jpg'
),
(
 'Anthurium','Hard','Anthuriums are cheery, exotic flowering houseplants that offer glossy, green heart-shaped leaves topped by heart-shaped pink, red, or white long-lasting blooms. Happily, anthuriums bloom almost all year long if they get enough light, fertilizer, and moisture.','https://www.ourhouseplants.com/imgs-content/Anthurium_houseplant.jpg'
),
(
'String of Pearls','Easy','String of pearls is a beautiful, cascading succulent that will add that little quirk to any house. The plant grows fast and propagates easily and can grow both indoor and outdoor. If you are looking for a beautiful succulent to grow, Strings of pearls is a great choice.','https://www.growjoy.com/store/pc/catalog/string_of_pearls_plant_1352_detail.jpg'
);

INSERT INTO reviews (content, plantid, rating) VALUES 
  (
'Love this Plant! So Easy to take of!', 1, 4
  ),
  (
'Amazing! favorite in my collection', 2, 5
  ),
  (
'Got it as a gift, great for the home!',3,4
  ),
  (
'Not my Fave',4,5
  );

COMMIT;