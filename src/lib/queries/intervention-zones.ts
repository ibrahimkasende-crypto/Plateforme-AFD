import {
  DEMO_INTERVENTION_ZONES,
  isDemoContentEnabled,
} from "@/config/demo-data/intervention-zones";
import { RDC_PROVINCE_PATHS } from "@/features/intervention-zones/data/rdc-province-paths";
import type {
  InterventionProvince,
  InterventionZonesBundle,
} from "@/features/intervention-zones/types/intervention-zone";
import { computeIntensity } from "@/features/intervention-zones/utils/intensity";
import { matchLocationToProvinceId } from "@/features/intervention-zones/utils/normalize-province";
import { createClientSafe } from "@/lib/supabase/safe";

function emptyProvince(
  province: (typeof RDC_PROVINCE_PATHS)[number],
): InterventionProvince {
  return {
    id: province.id,
    code: province.code,
    name: province.name,
    mainLocality: null,
    active: false,
    projectCount: 0,
    activityCount: null,
    beneficiaries: null,
    sectors: [],
    programmes: [],
    projects: [],
    intensity: "none",
    href: `/actions/zones-intervention?province=${province.id}`,
  };
}

function buildEmptyBundle(
  source: InterventionZonesBundle["source"],
): InterventionZonesBundle {
  return {
    provinces: RDC_PROVINCE_PATHS.map((province) => emptyProvince(province)),
    summary: {
      activeProvinces: 0,
      totalProjects: 0,
      totalBeneficiaries: null,
      totalSectors: 0,
      totalProgrammes: 0,
    },
    source,
    hasPublishedLocations: false,
    isDemo: false,
  };
}

function buildDemoBundle(): InterventionZonesBundle {
  const byId = new Map(
    RDC_PROVINCE_PATHS.map((province) => [
      province.id,
      emptyProvince(province),
    ]),
  );

  for (const demo of DEMO_INTERVENTION_ZONES) {
    const province = byId.get(demo.svgId);
    if (!province) continue;
    province.active = true;
    province.mainLocality = demo.mainLocality;
    province.projectCount = demo.projects;
    province.activityCount = demo.activities;
    province.beneficiaries = demo.beneficiaries;
    province.sectors = [...demo.sectors];
    province.programmes = [
      {
        id: `demo-${demo.svgId}`,
        title: demo.programmePrincipal,
        slug: "demo",
      },
    ];
    province.intensity = computeIntensity(demo.projects);
  }

  const provinces = [...byId.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "fr"),
  );
  const active = provinces.filter((province) => province.active);
  const totalProjects = active.reduce((sum, p) => sum + p.projectCount, 0);
  const totalBeneficiaries = active.reduce(
    (sum, p) => sum + (p.beneficiaries ?? 0),
    0,
  );
  const allSectors = new Set(active.flatMap((p) => p.sectors));

  return {
    provinces,
    summary: {
      activeProvinces: active.length,
      totalProjects,
      totalBeneficiaries,
      totalSectors: allSectors.size,
      totalProgrammes: active.length,
    },
    source: "demo",
    hasPublishedLocations: true,
    isDemo: true,
  };
}

export async function getPublicInterventionZones(): Promise<InterventionZonesBundle> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) {
      return isDemoContentEnabled()
        ? buildDemoBundle()
        : buildEmptyBundle("unavailable");
    }

    const { data: projects, error } = await supabase
      .from("projets")
      .select(
        "id, slug, title, location, beneficiaries, active, program_id",
      )
      .eq("active", true);

    if (error || !projects) {
      return buildEmptyBundle("unavailable");
    }

    const programIds = [
      ...new Set(
        projects
          .map((project) => project.program_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    const programmesById = new Map<
      string,
      { id: string; title: string; slug: string }
    >();

    if (programIds.length > 0) {
      const { data: programmes } = await supabase
        .from("programmes")
        .select("id, title, slug")
        .in("id", programIds);

      programmes?.forEach((programme) => {
        programmesById.set(programme.id, {
          id: programme.id,
          title: programme.title,
          slug: programme.slug,
        });
      });
    }

    const byId = new Map(
      RDC_PROVINCE_PATHS.map((province) => [
        province.id,
        emptyProvince(province),
      ]),
    );

    for (const project of projects) {
      const provinceId = matchLocationToProvinceId(project.location);
      if (!provinceId) continue;

      const province = byId.get(provinceId);
      if (!province) continue;

      province.projectCount += 1;
      province.active = true;
      province.projects.push({
        id: project.id,
        title: project.title,
        slug: project.slug,
        beneficiaries: project.beneficiaries,
      });

      if (project.beneficiaries != null) {
        province.beneficiaries =
          (province.beneficiaries ?? 0) + project.beneficiaries;
      }

      if (project.program_id) {
        const programme = programmesById.get(project.program_id);
        if (programme) {
          if (!province.programmes.some((item) => item.id === programme.id)) {
            province.programmes.push(programme);
          }
          if (!province.sectors.includes(programme.title)) {
            province.sectors.push(programme.title);
          }
        }
      }
    }

    const provinces = [...byId.values()]
      .map((province) => ({
        ...province,
        intensity: computeIntensity(province.projectCount),
        programmes: [...province.programmes].sort((a, b) =>
          a.title.localeCompare(b.title, "fr"),
        ),
        sectors: [...province.sectors].sort((a, b) => a.localeCompare(b, "fr")),
        projects: [...province.projects].sort((a, b) =>
          a.title.localeCompare(b.title, "fr"),
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));

    const active = provinces.filter((province) => province.active);
    const totalProjects = active.reduce(
      (sum, province) => sum + province.projectCount,
      0,
    );
    const beneficiarySum = active.reduce(
      (sum, province) => sum + (province.beneficiaries ?? 0),
      0,
    );
    const hasAnyBeneficiary = active.some(
      (province) => province.beneficiaries != null && province.beneficiaries > 0,
    );
    const allSectors = new Set(active.flatMap((province) => province.sectors));
    const allProgrammes = new Set(
      active.flatMap((province) => province.programmes.map((p) => p.id)),
    );

    if (active.length === 0 && isDemoContentEnabled()) {
      return buildDemoBundle();
    }

    return {
      provinces,
      summary: {
        activeProvinces: active.length,
        totalProjects,
        totalBeneficiaries: hasAnyBeneficiary ? beneficiarySum : null,
        totalSectors: allSectors.size,
        totalProgrammes: allProgrammes.size,
      },
      source: "supabase",
      hasPublishedLocations: active.length > 0,
      isDemo: false,
    };
  } catch {
    return isDemoContentEnabled()
      ? buildDemoBundle()
      : buildEmptyBundle("unavailable");
  }
}
