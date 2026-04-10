import { useState, useEffect, useCallback } from "react";
import {
  fetchUserBuilds,
  createBuild,
  updateBuild,
  deleteBuild,
} from "../api/builds.js";

/**
 * useBuilds — manages saved builds for the logged-in user.
 *
 * Usage:
 *   const { builds, loading, error, saveBuild, removeBuild } = useBuilds();
 */
export const useBuilds = () => {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBuilds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserBuilds();
      setBuilds(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("pcsensei_token");
    if (token) loadBuilds();
    else setLoading(false);
  }, [loadBuilds]);

  /**
   * Save or update a build.
   * If buildId is provided, updates existing; otherwise creates new.
   * @param {{ name, description, parts }} buildData
   * @param {string|null} buildId
   */
  const saveBuild = useCallback(async (buildData, buildId = null) => {
    const saved = buildId
      ? await updateBuild(buildId, buildData)
      : await createBuild(buildData);

    setBuilds((prev) =>
      buildId
        ? prev.map((b) => (b._id === buildId ? saved : b))
        : [saved, ...prev]
    );

    return saved;
  }, []);

  /**
   * Delete a build by ID.
   */
  const removeBuild = useCallback(async (buildId) => {
    await deleteBuild(buildId);
    setBuilds((prev) => prev.filter((b) => b._id !== buildId));
  }, []);

  return { builds, loading, error, saveBuild, removeBuild, reload: loadBuilds };
};
