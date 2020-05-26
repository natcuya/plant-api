function makePlantsArray() {
    return [
        {
            name: "Spider Plant",
            type:"easy",
            content: "Spider plant, also sometimes called airplane plant, is a houseplant that's withstood the tests of time. As popular today as it was generations ago, spider plant is wonderfully easy to grow. It thrives in bright light, but tolerates low light. It doesn't mind being watered frequently, but it can a while without water and still look good.",
            id: 1,
            img: "https://www.greenandvibrant.com/sites/default/files/field/image/Chlorophytum-Comosum-Spider-Plant.jpg"
            },
            {
            name: "Snake Plant",
            type:"easy",
            content:"If you're looking for an easy-care houseplant, you can't do much better than snake plant. This hardy indoor is still popular today -- generations of gardeners have called it a favorite -- because of how adaptable it is to a wide range of growing conditions.",
            id: 2,
            img: "https://smartgardenguide.com/wp-content/uploads/2019/08/snake-plant-leaves-curling-3.jpg"
            },
            {
            name: "Aloe Vera",
            type:"easy",
            content: "Often grown for the soothing gel in its leaves, aloe vera grows has gray-green toothed leaves and thrives in a bright place indoors or out.",
            id: 3,
            img:"https://www.almanac.com/sites/default/files/image_nodes/aloe-vera-white-pot_sunwand24-ss_edit.jpg"
            },
            {
            name: "Pothos",
            type:"easy",
            content: "pothos is one of the easiest you can grow -- and one of the most popular. This hardy indoor plant features dark green leaves splashed and marbled in shades of yellow, cream, or white. Pothos is wonderfully versatile in the home",
            id: 4,
            img:"https://www.almanac.com/sites/default/files/image_nodes/pothos_usmee_ss-crop.jpg"
             }, 
    ];
}
function makeMaliciousPlant() {
    const maliciousPlant = {
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        type: 'easy',
        content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        id: 911,
    }
    const expectedPlant = {
        ...maliciousPlant,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    }
    return {
        maliciousPlant,
        expectedPlant,
    }
}

module.exports = {
    makePlantsArray,
    makeMaliciousPlant,
  };