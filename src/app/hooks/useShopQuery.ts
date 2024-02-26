import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/services/api.service";
import { Query } from "../components/Search";

export const useShopQuery = ({
  query,
  shopDomain,
  enabled
}: {
  query: Query;
  shopDomain: string;
  enabled: boolean
}) => {
  const request = {
    query,
    shopDomain,
  };
  return useQuery({
    enabled,
    refetchOnMount: false,
    refetchInterval: false,
    retry: false,
    refetchOnWindowFocus: false,
    queryKey: [request],
    queryFn: () => api.post("/product/search", request),
  });
};