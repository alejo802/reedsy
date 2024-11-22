import { shallowMount } from "@vue/test-utils";
import BookItem from "@/components/BookItem.vue";

describe("BookItem.vue", () => {
  it("renders book details when expanded", async () => {
    const book = {
      id: 1,
      title: "Test Book",
      author: "Test Author",
      published: "2024",
      rating: "10",
      showDetails: false,
    };

    const wrapper = shallowMount(BookItem, {
      props: { book },
    });

    expect(wrapper.text()).toContain("Test Book");
    await wrapper.find(".book-header").trigger("click");
    expect(wrapper.text()).toContain("Published: 2024");
  });
});